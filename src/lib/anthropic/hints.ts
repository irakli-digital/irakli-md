import { anthropic } from './client';
import { HINT_GENERATOR_PROMPT, buildHintUserPrompt } from '@/lib/prompts/hints';
import type { Lesson } from '@/types/lesson';

export interface GeneratedHint {
  hint: string;
  focusArea: string;
  encouragement: string;
}

export async function generateHint(
  lesson: Lesson,
  userPrompt: string,
  hintNumber: number,
  previousHints: string[]
): Promise<GeneratedHint> {
  // If user hasn't typed anything yet, provide a starter hint
  if (!userPrompt || userPrompt.trim().length < 5) {
    return {
      hint: "Start by thinking about what information the AI needs to produce the right output. What's the context and goal?",
      focusArea: 'getting started',
      encouragement: "You've got this! Take a moment to read the scenario carefully.",
    };
  }

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: buildHintUserPrompt(
          lesson.scenario.title,
          lesson.scenario.goal,
          lesson.scenario.constraints,
          lesson.evaluation.rubric.map((r) => r.name),
          userPrompt,
          hintNumber,
          previousHints
        ),
      },
    ],
    system: HINT_GENERATOR_PROMPT,
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type');
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    // Fallback if no JSON found
    return {
      hint: content.text.slice(0, 200),
      focusArea: 'general',
      encouragement: 'Keep trying!',
    };
  }

  try {
    return JSON.parse(jsonMatch[0]) as GeneratedHint;
  } catch {
    return {
      hint: content.text.slice(0, 200),
      focusArea: 'general',
      encouragement: 'Keep trying!',
    };
  }
}
