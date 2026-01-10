import { anthropic } from './client';
import { EVALUATOR_SYSTEM_PROMPT, buildEvaluatorUserPrompt } from '@/lib/prompts/evaluator';
import type { Lesson } from '@/types/lesson';

export interface EvaluationResult {
  totalScore: number;
  rubricScores: {
    criterionId: string;
    criterionName: string;
    score: number;
    weight: number;
    weightedScore: number;
    feedback: string;
  }[];
  overallFeedback: {
    strengths: string[];
    weaknesses: string[];
    primaryIssue: string;
    suggestion: string;
  };
  improvedExample: string | null;
  encouragement: string;
}

export async function evaluatePrompt(
  lesson: Lesson,
  userPrompt: string
): Promise<EvaluationResult> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: buildEvaluatorUserPrompt(lesson, userPrompt),
      },
    ],
    system: EVALUATOR_SYSTEM_PROMPT,
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  // Parse JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  return JSON.parse(jsonMatch[0]) as EvaluationResult;
}
