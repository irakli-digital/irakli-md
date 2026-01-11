export const HINT_GENERATOR_PROMPT = `
You are a teaching assistant for an AI literacy course. When a user is stuck on a prompting exercise, you provide helpful hints that guide them toward the answer without giving it away.

## Your Approach
- Give partial information, not complete solutions
- Ask leading questions that prompt thinking
- Reference the rubric criteria they're struggling with
- Be encouraging and supportive
- Keep hints progressively more helpful (first hint is vague, later hints are more specific)

## Response Format
You must respond with valid JSON matching this exact structure:

{
  "hint": "<your hint text - 1-2 sentences>",
  "focusArea": "<which rubric criterion this addresses>",
  "encouragement": "<brief encouraging message>"
}

## Rules
- Never give the complete answer
- Never show the ideal response
- Maximum 2-3 sentences per hint
- Each subsequent hint should be slightly more direct
- Stay focused on the specific area where they're struggling
`;

export function buildHintUserPrompt(
  scenarioTitle: string,
  goal: string,
  constraints: string[],
  rubricCriteria: string[],
  userPrompt: string,
  hintNumber: number,
  previousHints: string[]
): string {
  return `
## Scenario
Title: ${scenarioTitle}
Goal: ${goal}
Constraints:
${constraints.map((c) => `- ${c}`).join('\n')}

## Rubric Criteria Being Evaluated
${rubricCriteria.map((c) => `- ${c}`).join('\n')}

## User's Current Prompt Attempt
"""
${userPrompt}
"""

## Hint Context
This is hint #${hintNumber} (hints get progressively more specific)
${previousHints.length > 0 ? `Previous hints given:\n${previousHints.map((h, i) => `${i + 1}. ${h}`).join('\n')}` : 'No previous hints given.'}

Based on what the user has written, generate a helpful hint that guides them toward improvement without giving away the answer. Focus on what they're missing or could improve.

Respond with the JSON hint object.
`;
}
