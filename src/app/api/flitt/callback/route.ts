import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { flittService } from '@/lib/flitt';
import type { FlittCallbackData } from '@/lib/flitt/types';

export async function POST(request: NextRequest) {
  try {
    // Parse callback data
    const formData = await request.formData();
    const callbackData: FlittCallbackData = {
      order_id: formData.get('order_id') as string,
      order_status: formData.get('order_status') as FlittCallbackData['order_status'],
      signature: formData.get('signature') as string,
      amount: formData.get('amount') as string,
      currency: formData.get('currency') as string,
      order_time: formData.get('order_time') as string,
      response_status: formData.get('response_status') as string,
      response_description: formData.get('response_description') as string,
      sender_email: formData.get('sender_email') as string,
      merchant_data: formData.get('merchant_data') as string,
      rectoken: formData.get('rectoken') as string,
      rectoken_lifetime: formData.get('rectoken_lifetime') as string,
      transaction_id: formData.get('transaction_id') as string,
      payment_id: formData.get('payment_id') as string,
    };

    console.log('[Flitt Callback] Received:', {
      order_id: callbackData.order_id,
      order_status: callbackData.order_status,
      hasRectoken: !!callbackData.rectoken,
    });

    // Validate signature
    const isValid = flittService.validateCallback(callbackData);
    if (!isValid) {
      console.error('[Flitt Callback] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find order
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.orderId, callbackData.order_id));

    if (!order) {
      console.error('[Flitt Callback] Order not found:', callbackData.order_id);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Handle approved payments
    if (callbackData.order_status === 'approved') {
      console.log('[Flitt Callback] Payment approved:', callbackData.order_id);

      // Update order status
      await db
        .update(orders)
        .set({
          status: 'completed',
          flittPaymentId: callbackData.payment_id,
          transactionId: callbackData.transaction_id,
          completedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Parse merchant data to get user info
      let merchantData: { userId?: string; tier?: string } = {};
      if (callbackData.merchant_data) {
        try {
          merchantData = JSON.parse(callbackData.merchant_data);
        } catch {
          console.warn('[Flitt Callback] Failed to parse merchant_data');
        }
      }

      const userId = merchantData.userId || order.userId;
      if (!userId) {
        console.error('[Flitt Callback] No userId found');
        return NextResponse.json({ error: 'No userId' }, { status: 400 });
      }

      // Update user profile based on order type
      const now = new Date();

      if (order.orderType === 'trial') {
        // Trial activation - set trial dates and save rectoken
        const trialEndDate = new Date(now);
        trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial

        await db
          .update(profiles)
          .set({
            subscriptionTier: 'trial',
            subscriptionStatus: 'trial',
            trialStartDate: now,
            trialEndDate: trialEndDate,
            rectoken: callbackData.rectoken || null,
            rectokenLifetime: callbackData.rectoken_lifetime || null,
            updatedAt: now,
          })
          .where(eq(profiles.id, userId));

        console.log('[Flitt Callback] Trial activated for user:', userId);
      } else if (order.orderType === 'subscription' || order.orderType === 'renewal') {
        // Subscription activation
        const subscriptionEndDate = new Date(now);
        if (order.packageType === 'annual') {
          subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
        } else {
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        }

        await db
          .update(profiles)
          .set({
            subscriptionTier: 'pro',
            subscriptionStatus: 'active',
            subscriptionPlan: order.packageType,
            subscriptionStartDate: now,
            subscriptionEndDate: subscriptionEndDate,
            rectoken: callbackData.rectoken || null,
            rectokenLifetime: callbackData.rectoken_lifetime || null,
            updatedAt: now,
          })
          .where(eq(profiles.id, userId));

        console.log('[Flitt Callback] Subscription activated for user:', userId);
      }
    } else if (callbackData.order_status === 'declined') {
      // Handle declined payments
      await db
        .update(orders)
        .set({
          status: 'failed',
          failureReason: callbackData.error_message || callbackData.response_description || 'Payment declined',
        })
        .where(eq(orders.id, order.id));

      console.log('[Flitt Callback] Payment declined:', callbackData.order_id);
    } else if (callbackData.order_status === 'expired') {
      // Handle expired orders
      await db
        .update(orders)
        .set({
          status: 'failed',
          failureReason: 'Payment expired',
        })
        .where(eq(orders.id, order.id));

      console.log('[Flitt Callback] Order expired:', callbackData.order_id);
    }

    // Return success to Flitt
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Flitt Callback] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

// Also handle GET for testing/verification
export async function GET() {
  return NextResponse.json({ status: 'Flitt callback endpoint active' });
}
