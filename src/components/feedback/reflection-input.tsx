'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { MessageSquare, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReflectionInputProps {
  attemptId: string;
  passed: boolean;
}

export function ReflectionInput({ attemptId, passed }: ReflectionInputProps) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(passed);

  const { data: existingReflection } = trpc.reflections.getByAttempt.useQuery(
    { attemptId },
    { enabled: !!attemptId }
  );

  const submitMutation = trpc.reflections.submit.useMutation();

  const handleSubmit = () => {
    if (text.trim().length < 10) return;
    submitMutation.mutate({ attemptId, reflectionText: text });
  };

  // Already has a reflection
  if (existingReflection) {
    return (
      <div className="border border-[#333] rounded-lg overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 bg-[#252525] hover:bg-[#2a2a2a] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#22C55E]" />
            <span className="text-[#E5E5E5] font-mono text-sm">reflection submitted</span>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[#737373]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#737373]" />
          )}
        </button>

        {expanded && (
          <div className="p-4 bg-[#1A1A1A] space-y-4">
            <div>
              <p className="text-[#737373] font-mono text-xs mb-2">your reflection:</p>
              <p className="text-[#A3A3A3] font-mono text-sm">{existingReflection.text}</p>
            </div>

            {existingReflection.insights && (
              <div className="border-t border-[#333] pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                  <span className="text-[#E5E5E5] font-mono text-xs">ai insights</span>
                </div>

                <div
                  className={cn(
                    'inline-block px-2 py-0.5 rounded text-xs font-mono',
                    existingReflection.insights.understandingLevel === 'strong'
                      ? 'bg-[#22C55E]/20 text-[#22C55E]'
                      : existingReflection.insights.understandingLevel === 'moderate'
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        : 'bg-[#EF4444]/20 text-[#EF4444]'
                  )}
                >
                  {existingReflection.insights.understandingLevel} understanding
                </div>

                {existingReflection.insights.correctInsights.length > 0 && (
                  <div>
                    <p className="text-[#22C55E] font-mono text-xs mb-1">what you got right:</p>
                    <ul className="text-[#A3A3A3] font-mono text-xs space-y-1">
                      {existingReflection.insights.correctInsights.map((i, idx) => (
                        <li key={idx}>• {i}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {existingReflection.insights.reinforcementNeeded.length > 0 && (
                  <div>
                    <p className="text-[#F59E0B] font-mono text-xs mb-1">areas to focus on:</p>
                    <ul className="text-[#A3A3A3] font-mono text-xs space-y-1">
                      {existingReflection.insights.reinforcementNeeded.map((i, idx) => (
                        <li key={idx}>• {i}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-[#737373] font-mono text-xs italic">
                  {existingReflection.insights.encouragement}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Submitted successfully
  if (submitMutation.isSuccess && submitMutation.data) {
    return (
      <div className="border border-[#22C55E]/30 rounded-lg p-4 bg-[#252525] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D97706]" />
          <span className="text-[#E5E5E5] font-mono text-sm">reflection analyzed</span>
        </div>

        <div
          className={cn(
            'inline-block px-2 py-0.5 rounded text-xs font-mono',
            submitMutation.data.insights.understandingLevel === 'strong'
              ? 'bg-[#22C55E]/20 text-[#22C55E]'
              : submitMutation.data.insights.understandingLevel === 'moderate'
                ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                : 'bg-[#EF4444]/20 text-[#EF4444]'
          )}
        >
          {submitMutation.data.insights.understandingLevel} understanding
        </div>

        {submitMutation.data.insights.correctInsights.length > 0 && (
          <div>
            <p className="text-[#22C55E] font-mono text-xs mb-1">what you learned:</p>
            <ul className="text-[#A3A3A3] font-mono text-xs space-y-1">
              {submitMutation.data.insights.correctInsights.map((i, idx) => (
                <li key={idx}>• {i}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[#737373] font-mono text-xs italic">
          {submitMutation.data.insights.encouragement}
        </p>
      </div>
    );
  }

  // Input form
  return (
    <div className="border border-[#333] rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 bg-[#252525] hover:bg-[#2a2a2a] transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#D97706]" />
          <span className="text-[#E5E5E5] font-mono text-sm">
            {passed ? 'reflect on what you learned' : 'reflect on this attempt'}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-[#737373]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#737373]" />
        )}
      </button>

      {expanded && (
        <div className="p-4 bg-[#1A1A1A] space-y-4">
          <p className="text-[#737373] font-mono text-xs">
            {passed
              ? 'what did you learn from this exercise? what would you do differently next time?'
              : 'what was challenging about this? what concepts are you unclear about?'}
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="write your reflection here..."
            className="w-full h-24 bg-[#252525] border border-[#333] rounded p-3 font-mono text-sm text-[#E5E5E5] placeholder:text-[#525252] focus:border-[#D97706] outline-none resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-[#525252] font-mono text-xs">
              {text.length}/2000 characters
            </span>
            <button
              onClick={handleSubmit}
              disabled={text.trim().length < 10 || submitMutation.isPending}
              className={cn(
                'px-4 py-2 rounded font-mono text-sm transition-colors',
                text.trim().length >= 10 && !submitMutation.isPending
                  ? 'bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A]'
                  : 'bg-[#333] text-[#525252] cursor-not-allowed'
              )}
            >
              {submitMutation.isPending ? 'analyzing...' : 'submit reflection'}
            </button>
          </div>

          {submitMutation.isError && (
            <p className="text-[#EF4444] font-mono text-xs">
              error: {submitMutation.error.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
