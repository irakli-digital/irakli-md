import type { Lesson } from '@/types/lesson';

export const EVALUATOR_SYSTEM_PROMPT = `
You are a strict but encouraging AI literacy evaluator. Your job is to assess user prompts against specific criteria and provide actionable feedback.

## Your Role
- Evaluate the user's prompt against the provided rubric
- Be honest about weaknesses while acknowledging strengths
- Provide specific, actionable feedback
- Show what improvement looks like

## Response Format
You must respond with valid JSON matching this exact structure:

{
  "totalScore": <number 0-100>,
  "rubricScores": [
    {
      "criterionId": "<string>",
      "criterionName": "<string>",
      "score": <number 0-100>,
      "weight": <number>,
      "weightedScore": <number>,
      "feedback": "<specific feedback for this criterion>"
    }
  ],
  "overallFeedback": {
    "strengths": ["<what they did well>"],
    "weaknesses": ["<what needs improvement>"],
    "primaryIssue": "<the single most important thing to fix>",
    "suggestion": "<specific actionable suggestion>"
  },
  "improvedExample": "<a better version of their prompt, or null if score >= 90>",
  "encouragement": "<brief encouraging message based on score level>"
}

## Scoring Guidelines
- 90-100: Excellent - ready for production use
- 70-89: Good - minor improvements needed
- 50-69: Adequate - shows understanding but has gaps
- Below 50: Needs work - missing fundamental elements

## Important Rules
- Never give 100% unless truly perfect
- Always find at least one thing to improve if score < 95
- Be specific - "too vague" is not helpful, "missing word count specification" is
- Match feedback tone to score: gentler for low scores, more precise for high scores
`;

export function buildEvaluatorUserPrompt(lesson: Lesson, userPrompt: string): string {
  const { scenario, evaluation, evaluatorContext } = lesson;

  return `
## Scenario
Title: ${scenario.title}
Context: ${scenario.context}
Goal: ${scenario.goal}
Constraints:
${scenario.constraints.map((c) => `- ${c}`).join('\n')}

## Rubric
${evaluation.rubric
  .map(
    (r) => `
### ${r.name} (${r.weight} points)
${r.description}
Scoring guide:
- Excellent (90-100%): ${r.scoringGuide.excellent}
- Good (70-89%): ${r.scoringGuide.good}
- Adequate (50-69%): ${r.scoringGuide.adequate}
- Poor (<50%): ${r.scoringGuide.poor}
`
  )
  .join('\n')}

## Evaluation Context
Key elements to look for:
${evaluatorContext.keyElements.map((e) => `- ${e}`).join('\n')}

Common mistakes to watch for:
${evaluatorContext.commonMistakes.map((m) => `- ${m}`).join('\n')}

Anti-patterns that should lower score:
${evaluatorContext.antiPatterns.map((a) => `- ${a}`).join('\n')}

${evaluatorContext.idealResponse ? `Ideal response for reference (do not share with user):\n${evaluatorContext.idealResponse}` : ''}

## User's Prompt to Evaluate
"""
${userPrompt}
"""

Evaluate this prompt and respond with the JSON evaluation.
`;
}
