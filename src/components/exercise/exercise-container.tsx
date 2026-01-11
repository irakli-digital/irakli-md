'use client';

import { useState } from 'react';
import { Lightbulb, Clock, Sparkles } from 'lucide-react';
import { PromptInput } from './prompt-input';
import { FeedbackPanel } from '@/components/feedback/feedback-panel';
import { TerminalWindow } from '@/components/terminal/terminal-window';
import { TerminalLine } from '@/components/terminal/terminal-line';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc/client';
import type { PublicLesson } from '@/types/lesson';
import type { EvaluationResult } from '@/lib/anthropic/evaluator';

interface GeneratedHint {
  hint: string;
  focusArea: string;
  encouragement: string;
}

interface ExerciseContainerProps {
  lesson: PublicLesson;
  onComplete?: () => void;
}

export function ExerciseContainer({ lesson, onComplete }: ExerciseContainerProps) {
  const [prompt, setPrompt] = useState('');
  const [hints, setHints] = useState<GeneratedHint[]>([]);
  const [result, setResult] = useState<(EvaluationResult & { passed: boolean; attemptId: string }) | null>(null);

  const submitMutation = trpc.attempt.submit.useMutation({
    onSuccess: (data) => {
      setResult(data);
      if (data.passed && onComplete) {
        onComplete();
      }
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate({
      lessonId: lesson.id,
      promptText: prompt,
    });
  };

  const getHintMutation = trpc.attempt.getHint.useMutation({
    onSuccess: (data) => {
      setHints((prev) => [...prev, data]);
    },
  });

  const handleRetry = () => {
    setResult(null);
    setPrompt('');
    setHints([]);
  };

  const requestHint = () => {
    if (hints.length < 5 && !getHintMutation.isPending) {
      getHintMutation.mutate({
        lessonId: lesson.id,
        currentPrompt: prompt,
        hintNumber: hints.length + 1,
        previousHints: hints.map((h) => h.hint),
      });
    }
  };

  const stageColors: Record<number, string> = {
    1: '#3B82F6',
    2: '#8B5CF6',
    3: '#F59E0B',
    4: '#10B981',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Scenario Info */}
      <TerminalWindow title={`~/scenarios/${lesson.id}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: `${stageColors[lesson.meta.stage]}20`, color: stageColors[lesson.meta.stage] }}
              >
                stage {lesson.meta.stage}
              </span>
              <span className="text-xs text-[#737373]">{lesson.meta.skill}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#737373]">
              <Clock className="h-3 w-3" />
              <span>~{lesson.meta.estimatedMinutes} min</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <TerminalLine prefix="scenario:" prefixColor="accent">
              {lesson.scenario.title}
            </TerminalLine>
          </div>

          {/* Context */}
          <div>
            <TerminalLine prefix="context:" prefixColor="muted">
              {''}
            </TerminalLine>
            <p className="text-[#A3A3A3] text-sm mt-1 ml-4">{lesson.scenario.context}</p>
          </div>

          {/* Goal */}
          <div>
            <TerminalLine prefix="goal:" prefixColor="success">
              {''}
            </TerminalLine>
            <p className="text-[#E5E5E5] text-sm mt-1 ml-4">{lesson.scenario.goal}</p>
          </div>

          {/* Constraints */}
          <div>
            <TerminalLine prefix="constraints:" prefixColor="muted">
              {''}
            </TerminalLine>
            <ul className="text-sm text-[#A3A3A3] mt-1 ml-4 space-y-1">
              {lesson.scenario.constraints.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>

          {/* Example Input */}
          {lesson.scenario.exampleInput && (
            <div>
              <TerminalLine prefix="sample data:" prefixColor="muted">
                {''}
              </TerminalLine>
              <pre className="text-xs text-[#737373] mt-1 ml-4 p-2 bg-[#1A1A1A] rounded whitespace-pre-wrap">
                {lesson.scenario.exampleInput}
              </pre>
            </div>
          )}
        </div>
      </TerminalWindow>

      {/* AI Hints */}
      {hints.length > 0 && (
        <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
            <span className="text-xs text-[#F59E0B] font-mono">ai-generated hints</span>
          </div>
          <div className="space-y-3">
            {hints.map((hint, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#737373] font-mono">hint {i + 1}</span>
                  <span className="text-xs text-[#525252] font-mono">• {hint.focusArea}</span>
                </div>
                <p className="text-sm text-[#E5E5E5] font-mono">{hint.hint}</p>
                {i === hints.length - 1 && (
                  <p className="text-xs text-[#A3A3A3] italic font-mono mt-1">{hint.encouragement}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input or Result */}
      {!result ? (
        <TerminalWindow title="your prompt">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <TerminalLine prefix=">" prefixColor="accent">
                write your prompt below
              </TerminalLine>
              {hints.length < 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestHint}
                  disabled={getHintMutation.isPending}
                  className="text-[#F59E0B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 font-mono text-xs"
                >
                  {getHintMutation.isPending ? (
                    <>generating hint...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-1" />
                      get ai hint ({5 - hints.length} left)
                    </>
                  )}
                </Button>
              )}
            </div>

            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleSubmit}
              disabled={submitMutation.isPending}
              placeholder="write your prompt to complete the scenario..."
            />

            {submitMutation.isPending && (
              <TerminalLine prefixColor="muted" animate>
                evaluating prompt...
              </TerminalLine>
            )}

            {submitMutation.error && (
              <TerminalLine prefix="error:" prefixColor="error">
                {submitMutation.error.message}
              </TerminalLine>
            )}
          </div>
        </TerminalWindow>
      ) : (
        <FeedbackPanel evaluation={result} passed={result.passed} attemptId={result.attemptId} onRetry={handleRetry} />
      )}
    </div>
  );
}
