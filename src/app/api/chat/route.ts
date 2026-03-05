import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { IRAKLI_AGENT_SYSTEM_PROMPT } from '@/lib/prompts/irakli-agent';
import { db } from '@/lib/db';
import { chatLeads, chatMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Rate Limiting (in-memory, per-IP) ---
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // max requests per window

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60_000);

// --- Input Validation ---
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES = 30;

function sanitizeMessages(
  messages: Array<{ role: string; content: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> {
  if (!Array.isArray(messages)) return [];

  return messages
    .slice(-MAX_MESSAGES)
    .filter(
      (m) =>
        m &&
        typeof m.role === 'string' &&
        typeof m.content === 'string' &&
        (m.role === 'user' || m.role === 'assistant')
    )
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));
}

// --- GET client IP from request ---
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// --- Main Handler (Streaming) ---
export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  // Rate limit check
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const leadId = body.lead_id;
    const messages = sanitizeMessages(body.messages);

    if (!leadId || typeof leadId !== 'string') {
      return NextResponse.json(
        { error: 'Email registration required before chatting.' },
        { status: 401 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Verify lead exists
    const lead = await db
      .select()
      .from(chatLeads)
      .where(eq(chatLeads.id, leadId))
      .limit(1);

    if (lead.length === 0) {
      return NextResponse.json(
        { error: 'Invalid session. Please register your email again.' },
        { status: 401 }
      );
    }

    // Save the latest user message to database
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      await db.insert(chatMessages).values({
        leadId,
        role: 'user',
        content: lastUserMessage.content,
      });
    }

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: IRAKLI_AGENT_SYSTEM_PROMPT },
        ...messages,
      ],
      max_completion_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    // Convert OpenAI stream to a ReadableStream for the Response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();

          // Save assistant response to database after stream completes
          if (fullResponse) {
            try {
              await db.insert(chatMessages).values({
                leadId,
                role: 'assistant',
                content: fullResponse,
              });
            } catch (err) {
              console.error('Failed to save assistant message:', err);
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
