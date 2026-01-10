import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { db } from '@/lib/db';
import { profiles, orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { flittService, SUBSCRIPTION_PLANS, TRIAL_AMOUNT_TETRI } from '@/lib/flitt';
import { v4 as uuidv4 } from 'uuid';

export const subscriptionRouter = router({
  // Get available subscription plans
  getPlans: protectedProcedure.query(() => {
    return {
      plans: Object.values(SUBSCRIPTION_PLANS),
      trialDays: 7,
    };
  }),

  // Get current user's subscription status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, ctx.user.id));

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
    }

    const now = new Date();
    let daysRemaining = 0;
    let isExpired = false;

    if (profile.subscriptionTier === 'trial' && profile.trialEndDate) {
      const endDate = new Date(profile.trialEndDate);
      daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      isExpired = endDate < now;
    } else if (profile.subscriptionTier === 'pro' && profile.subscriptionEndDate) {
      const endDate = new Date(profile.subscriptionEndDate);
      daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      isExpired = endDate < now;
    }

    return {
      tier: profile.subscriptionTier || 'free',
      status: profile.subscriptionStatus || 'active',
      plan: profile.subscriptionPlan,
      daysRemaining,
      isExpired,
      trialStartDate: profile.trialStartDate,
      trialEndDate: profile.trialEndDate,
      subscriptionStartDate: profile.subscriptionStartDate,
      subscriptionEndDate: profile.subscriptionEndDate,
      hasRectoken: !!profile.rectoken,
    };
  }),

  // Start 7-day free trial (captures card for rectoken)
  startTrial: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if user already used trial
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, ctx.user.id));

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
    }

    if (profile.trialStartDate) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Trial already used. Please subscribe to continue.',
      });
    }

    if (profile.subscriptionTier === 'pro') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Already subscribed',
      });
    }

    // Create order for trial (minimal amount for card verification)
    const orderId = `trial-${uuidv4()}`;

    await db.insert(orders).values({
      orderId,
      userId: ctx.user.id,
      orderType: 'trial',
      packageType: 'monthly', // Default to monthly after trial
      amount: TRIAL_AMOUNT_TETRI,
      currency: 'GEL',
      status: 'pending',
    });

    // Create Flitt checkout
    const result = await flittService.createCheckout({
      orderId,
      userId: ctx.user.id,
      amount: TRIAL_AMOUNT_TETRI / 100, // Convert tetri to GEL
      description: 'AI Literacy - 7-Day Free Trial',
      customerEmail: profile.email,
      tier: 'trial',
    });

    if (!result.success) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: result.error || 'Failed to create checkout',
      });
    }

    return {
      checkoutUrl: result.checkoutUrl,
      orderId,
    };
  }),

  // Subscribe directly (skip trial)
  subscribe: protectedProcedure
    .input(
      z.object({
        plan: z.enum(['monthly', 'annual']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, ctx.user.id));

      if (!profile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
      }

      const selectedPlan = SUBSCRIPTION_PLANS[input.plan];
      if (!selectedPlan) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid plan' });
      }

      // Create order
      const orderId = `sub-${uuidv4()}`;

      await db.insert(orders).values({
        orderId,
        userId: ctx.user.id,
        orderType: 'subscription',
        packageType: input.plan,
        amount: selectedPlan.priceInTetri,
        currency: 'GEL',
        status: 'pending',
      });

      // Create Flitt checkout
      const result = await flittService.createCheckout({
        orderId,
        userId: ctx.user.id,
        amount: selectedPlan.price,
        description: `AI Literacy - ${selectedPlan.name}`,
        customerEmail: profile.email,
        tier: input.plan,
      });

      if (!result.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error || 'Failed to create checkout',
        });
      }

      return {
        checkoutUrl: result.checkoutUrl,
        orderId,
      };
    }),

  // Cancel subscription (keeps access until end date)
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, ctx.user.id));

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
    }

    if (profile.subscriptionTier !== 'pro') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No active subscription to cancel',
      });
    }

    // Update status to cancelled (user keeps access until end date)
    await db
      .update(profiles)
      .set({
        subscriptionStatus: 'cancelled',
        rectoken: null, // Remove rectoken to prevent future charges
        rectokenLifetime: null,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, ctx.user.id));

    return {
      success: true,
      message: 'Subscription cancelled. You will retain access until your current period ends.',
      accessUntil: profile.subscriptionEndDate,
    };
  }),

  // Get order history
  getOrderHistory: protectedProcedure.query(async ({ ctx }) => {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(orders.createdAt);

    return userOrders.map((order) => ({
      id: order.id,
      orderId: order.orderId,
      type: order.orderType,
      plan: order.packageType,
      amount: order.amount / 100, // Convert tetri to GEL
      status: order.status,
      createdAt: order.createdAt,
      completedAt: order.completedAt,
    }));
  }),
});
