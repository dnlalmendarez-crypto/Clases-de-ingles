export type UserLevel = "nulo" | "principiante" | "basico";

export interface VocabItem {
  id: string;
  emoji: string;
  en: string;
  es: string;
  exampleEn: string;
  exampleEs: string;
}

export interface WritingPrompt {
  id: string;
  promptEs: string;
  answerEn: string;
  hintEs?: string;
}

export interface Unit {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  vocab: VocabItem[];
  writingPrompts: WritingPrompt[];
}

export type ActivityKind = "presentation" | "listening" | "speaking" | "writing" | "results";

export interface UnitProgress {
  unitId: string;
  completed: boolean;
  stars: number; // 0-3
  bestScore: number; // 0-100
}

export interface ProgressState {
  level: UserLevel;
  name: string;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  units: Record<string, UnitProgress>;
  onboardingDone: boolean;
}
