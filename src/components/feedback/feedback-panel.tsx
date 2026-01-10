'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EvaluationResult } from '@/lib/anthropic/evaluator';

interface FeedbackPanelProps {
  evaluation: EvaluationResult;
  passed: boolean;
  onRetry: () => void;
  onNext?: () => void;
}

export function FeedbackPanel({ evaluation, passed, onRetry, onNext }: FeedbackPanelProps) {
  const scoreColor =
    evaluation.totalScore >= 80
      ? 'text-[#22C55E]'
      : evaluation.totalScore >= 50
        ? 'text-[#F59E0B]'
        : 'text-[#EF4444]';

  return (
    <div
      className={cn(
        'rounded-lg border-2 bg-[#252525] p-6 font-mono',
        passed ? 'border-[#22C55E]' : 'border-[#EF4444]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {passed ? (
            <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
          ) : (
            <XCircle className="h-6 w-6 text-[#EF4444]" />
          )}
          <span className="text-[#E5E5E5] text-lg">
            {passed ? 'passed!' : 'keep practicing'}
          </span>
        </div>
        <div className={cn('text-4xl font-bold', scoreColor)}>{evaluation.totalScore}%</div>
      </div>

      <p className="text-[#A3A3A3] text-sm mb-6">{evaluation.encouragement}</p>

      {/* Score Breakdown */}
      <div className="mb-6">
        <h4 className="text-[#E5E5E5] text-sm mb-3">score breakdown:</h4>
        <div className="space-y-3">
          {evaluation.rubricScores.map((item) => (
            <div key={item.criterionId} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#A3A3A3]">{item.criterionName.toLowerCase()}</span>
                <span className="text-[#E5E5E5]">{item.score}%</span>
              </div>
              <div className="h-2 bg-[#333] rounded overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    item.score >= 80
                      ? 'bg-[#22C55E]'
                      : item.score >= 50
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#EF4444]'
                  )}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <p className="text-xs text-[#737373]">{item.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-[#22C55E] text-sm mb-2">+ strengths:</h4>
          <ul className="text-xs text-[#A3A3A3] space-y-1">
            {evaluation.overallFeedback.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[#EF4444] text-sm mb-2">- to improve:</h4>
          <ul className="text-xs text-[#A3A3A3] space-y-1">
            {evaluation.overallFeedback.weaknesses.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Issue */}
      <div className="p-3 bg-[#1A1A1A] rounded mb-6">
        <h4 className="text-[#D97706] text-sm mb-1">{'>'}  key improvement:</h4>
        <p className="text-xs text-[#E5E5E5]">{evaluation.overallFeedback.primaryIssue}</p>
        <p className="text-xs text-[#737373] mt-1">{evaluation.overallFeedback.suggestion}</p>
      </div>

      {/* Improved Example */}
      {evaluation.improvedExample && (
        <div className="mb-6">
          <h4 className="text-[#E5E5E5] text-sm mb-2">improved example:</h4>
          <pre className="p-3 bg-[#1A1A1A] rounded text-xs text-[#A3A3A3] whitespace-pre-wrap overflow-x-auto">
            {evaluation.improvedExample}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onRetry}
          variant="outline"
          className="flex-1 border-[#333] bg-transparent text-[#E5E5E5] hover:bg-[#333] font-mono"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          retry
        </Button>
        {passed && onNext && (
          <Button
            onClick={onNext}
            className="flex-1 bg-[#D97706] hover:bg-[#F59E0B] text-[#1A1A1A] font-mono"
          >
            next scenario
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
