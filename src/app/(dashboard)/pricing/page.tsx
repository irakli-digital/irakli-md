'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { PlanCard, FreePlanCard, TrialCard } from '@/components/subscription/plan-card';
import { trpc } from '@/lib/trpc/client';
import { CreditCard, Shield, Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Derive success state from URL params
  const isSuccess = searchParams.get('success') === 'true';

  const { data: plans } = trpc.subscription.getPlans.useQuery();
  const { data: status, refetch: refetchStatus } = trpc.subscription.getStatus.useQuery();

  const startTrial = trpc.subscription.startTrial.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.loading('Redirecting to payment...');
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(null);
    },
  });

  const subscribe = trpc.subscription.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.loading('Redirecting to payment...');
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(null);
    },
  });

  // Handle success from Flitt callback
  useEffect(() => {
    if (isSuccess) {
      refetchStatus();
      toast.success('Payment successful!');
      // Clear the URL params after a brief delay
      const timer = setTimeout(() => {
        router.replace('/pricing');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetchStatus, router]);

  const handleStartTrial = () => {
    setIsProcessing('trial');
    startTrial.mutate();
  };

  const handleSubscribe = (plan: 'monthly' | 'annual') => {
    setIsProcessing(plan);
    subscribe.mutate({ plan });
  };

  const currentTier = status?.tier || 'free';
  const hasUsedTrial = !!status?.trialStartDate;

  return (
    <div className="space-y-8">
      {/* Success message */}
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
          <CheckCircle className="h-5 w-5 text-[#22C55E]" />
          <div>
            <p className="font-mono text-sm text-[#E5E5E5]">Payment successful!</p>
            <p className="font-mono text-xs text-[#737373]">
              {status?.tier === 'trial'
                ? 'Your 7-day trial has started. Enjoy full access!'
                : 'Your subscription is now active.'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-mono text-[#E5E5E5]">Choose Your Plan</h1>
        <p className="text-[#737373] font-mono">
          Unlock all stages and master AI literacy
        </p>
      </div>

      {/* Current Status */}
      {status && (
        <TerminalWindow title="~/subscription/status">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#737373] font-mono text-sm">Current plan:</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-sm font-mono font-medium',
                  currentTier === 'pro'
                    ? 'bg-[#D97706]/20 text-[#D97706]'
                    : currentTier === 'trial'
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                      : 'bg-[#333] text-[#737373]'
                )}
              >
                {currentTier.toUpperCase()}
              </span>
            </div>
            {status.daysRemaining > 0 && (currentTier === 'trial' || currentTier === 'pro') && (
              <div className="flex items-center gap-2">
                <span className="text-[#737373] font-mono text-sm">Days remaining:</span>
                <span className="text-[#E5E5E5] font-mono font-medium">{status.daysRemaining}</span>
              </div>
            )}
            {status.isExpired && (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#EF4444]/20 text-[#EF4444]">
                EXPIRED
              </span>
            )}
          </div>
        </TerminalWindow>
      )}

      {/* Trial CTA (only for free users who haven't used trial) */}
      {currentTier === 'free' && !hasUsedTrial && (
        <TrialCard
          onStartTrial={handleStartTrial}
          isLoading={isProcessing === 'trial'}
          disabled={!!isProcessing}
        />
      )}

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <FreePlanCard isCurrentPlan={currentTier === 'free'} />

        {/* Monthly Plan */}
        {plans?.plans.find((p) => p.id === 'monthly') && (
          <PlanCard
            plan={plans.plans.find((p) => p.id === 'monthly')!}
            isCurrentPlan={currentTier === 'pro' && status?.plan === 'monthly'}
            onSelect={() => handleSubscribe('monthly')}
            isLoading={isProcessing === 'monthly'}
            disabled={!!isProcessing || (currentTier === 'pro' && !status?.isExpired)}
            buttonText={currentTier === 'trial' ? 'Upgrade to Monthly' : 'Subscribe Monthly'}
          />
        )}

        {/* Annual Plan */}
        {plans?.plans.find((p) => p.id === 'annual') && (
          <PlanCard
            plan={plans.plans.find((p) => p.id === 'annual')!}
            isCurrentPlan={currentTier === 'pro' && status?.plan === 'annual'}
            isFeatured
            onSelect={() => handleSubscribe('annual')}
            isLoading={isProcessing === 'annual'}
            disabled={!!isProcessing || (currentTier === 'pro' && !status?.isExpired)}
            buttonText={currentTier === 'trial' ? 'Upgrade to Annual' : 'Subscribe Annual'}
          />
        )}
      </div>

      {/* Features Comparison */}
      <TerminalWindow title="~/features">
        <div className="space-y-4">
          <TerminalLine prefix=">" prefixColor="accent">
            what you get with Pro
          </TerminalLine>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-sm text-[#E5E5E5]">All 4 Learning Stages</p>
                <p className="font-mono text-xs text-[#737373]">
                  From prompting basics to vibe coding
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-sm text-[#E5E5E5]">Certification Exams</p>
                <p className="font-mono text-xs text-[#737373]">
                  Earn verified certificates for each stage
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-sm text-[#E5E5E5]">Unlimited Scenarios</p>
                <p className="font-mono text-xs text-[#737373]">
                  Practice as much as you want, no limits
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-sm text-[#E5E5E5]">Detailed AI Feedback</p>
                <p className="font-mono text-xs text-[#737373]">
                  Learn from personalized evaluations
                </p>
              </div>
            </div>
          </div>
        </div>
      </TerminalWindow>

      {/* FAQ */}
      <TerminalWindow title="~/faq">
        <div className="space-y-4">
          <div className="space-y-2">
            <TerminalLine prefix="Q:" prefixColor="accent">
              Can I cancel anytime?
            </TerminalLine>
            <p className="font-mono text-sm text-[#A3A3A3] pl-6">
              Yes, you can cancel your subscription at any time. You&apos;ll keep access until the end
              of your billing period.
            </p>
          </div>
          <div className="space-y-2">
            <TerminalLine prefix="Q:" prefixColor="accent">
              What happens after my trial?
            </TerminalLine>
            <p className="font-mono text-sm text-[#A3A3A3] pl-6">
              After 7 days, your card will be charged 29 GEL for the monthly plan. You can upgrade
              to annual or cancel before the trial ends.
            </p>
          </div>
          <div className="space-y-2">
            <TerminalLine prefix="Q:" prefixColor="accent">
              Is my payment secure?
            </TerminalLine>
            <p className="font-mono text-sm text-[#A3A3A3] pl-6">
              All payments are processed securely through Flitt, a licensed payment provider.
              We never store your card details.
            </p>
          </div>
        </div>
      </TerminalWindow>
    </div>
  );
}
