import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';
import { IRAKLI_AGENT_SYSTEM_PROMPT } from '@/lib/prompts/irakli-agent';

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

// --- Email Detection & Lead Storage ---
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// In-memory set to avoid duplicate leads within a server lifecycle
const seenEmails = new Set<string>();

const LEADS_FILE = path.join(process.cwd(), 'leads.json');

interface Lead {
  email: string;
  context: string;
  timestamp: string;
  ip: string;
}

async function readLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function storeLead(email: string, context: string, ip: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();

  if (seenEmails.has(normalizedEmail)) {
    return false;
  }

  console.log('=== NEW LEAD ===');
  console.log('Email:', normalizedEmail);
  console.log('Context:', context);
  console.log('IP:', ip);
  console.log('Timestamp:', new Date().toISOString());
  console.log('================');

  try {
    const leads = await readLeads();

    if (leads.some((l) => l.email === normalizedEmail)) {
      seenEmails.add(normalizedEmail);
      return false;
    }

    leads.push({
      email: normalizedEmail,
      context,
      timestamp: new Date().toISOString(),
      ip,
    });

    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    seenEmails.add(normalizedEmail);
    return true;
  } catch (err) {
    console.error('Failed to write lead to file:', err);
    seenEmails.add(normalizedEmail);
    return true;
  }
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
    const messages = sanitizeMessages(body.messages);

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Check if the latest user message contains an email
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === 'user') {
      const emailMatch = lastUserMessage.content.match(EMAIL_REGEX);
      if (emailMatch) {
        const context = messages
          .slice(-6)
          .map((m) => `${m.role}: ${m.content}`)
          .join('\n');
        await storeLead(emailMatch[0], context, ip);
      }
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
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
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
