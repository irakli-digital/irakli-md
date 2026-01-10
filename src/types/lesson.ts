export interface Lesson {
  id: string;
  version: number;

  meta: {
    stage: 1 | 2 | 3 | 4;
    skill: string;
    difficulty: 1 | 2 | 3 | 4 | 5;
    estimatedMinutes: number;
    prerequisites: string[];
    tags: string[];
  };

  scenario: {
    title: string;
    context: string;
    goal: string;
    constraints: string[];
    exampleInput?: string;
    hints: string[];
  };

  evaluation: {
    rubric: RubricItem[];
    passingScore: number;
    maxAttempts?: number;
    timeLimit?: number;
  };

  evaluatorContext: {
    idealResponse?: string;
    commonMistakes: string[];
    keyElements: string[];
    antiPatterns: string[];
  };
}

export interface RubricItem {
  id: string;
  name: string;
  weight: number;
  description: string;
  scoringGuide: {
    excellent: string;
    good: string;
    adequate: string;
    poor: string;
  };
}

// Public lesson (without evaluator context)
export type PublicLesson = Omit<Lesson, 'evaluatorContext'>;
