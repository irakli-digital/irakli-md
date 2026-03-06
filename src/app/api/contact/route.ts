import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { formLeads } from '@/lib/db/schema';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_MESSAGE_LENGTH = 2000;

// Simple in-memory rate limit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 5; // 5 submissions per minute max
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();
    const reason = (body.reason || '').trim().slice(0, 100) || null;
    const message = (body.message || '').trim().slice(0, MAX_MESSAGE_LENGTH);

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Please provide a message.' },
        { status: 400 }
      );
    }

    await db.insert(formLeads).values({ email, reason, message, source: 'contact_form', ip });

    console.log('=== NEW FORM LEAD ===');
    console.log('Email:', email);
    console.log('Reason:', reason);
    console.log('Message:', message.slice(0, 100));
    console.log('=====================');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
