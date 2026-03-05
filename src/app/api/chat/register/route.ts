import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { chatLeads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').toLowerCase().trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const ip = getClientIP(req);

    // Check if lead already exists
    const existing = await db
      .select()
      .from(chatLeads)
      .where(eq(chatLeads.email, email))
      .limit(1);

    if (existing.length > 0) {
      // Return existing lead_id for persistent session
      return NextResponse.json({ lead_id: existing[0].id, returning: true });
    }

    // Create new lead
    const [newLead] = await db
      .insert(chatLeads)
      .values({ email, ip })
      .returning({ id: chatLeads.id });

    console.log('=== NEW CHAT LEAD ===');
    console.log('Email:', email);
    console.log('IP:', ip);
    console.log('Lead ID:', newLead.id);
    console.log('=====================');

    return NextResponse.json({ lead_id: newLead.id, returning: false });
  } catch (error) {
    console.error('Chat register error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
