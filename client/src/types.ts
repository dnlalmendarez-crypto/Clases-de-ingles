export type UserLevel = "nulo" | "principiante" | "basico";

export interface VocabItem {
  id: string;
  emoji: string;
  en: string;
  es: string;
  exampleEn: string;
  exampleEs: string;
  /** Nota breve de uso/gramática en español, para frases que lo ameritan. */
  explanationEs?: string;
}

export interface SlangItem {
  id: string;
  phraseEn: string;
  meaningEs: string;
  exampleEn: string;
  exampleEs: string;
  /** Cuándo/con quién es apropiado usarlo (registro). */
  registerEs: string;
}

export interface DialogueLine {
  speaker: "A" | "B";
  en: string;
  es: string;
}

export interface DialogueCheck {
  questionEs: string;
  options: string[];
  correctIndex: number;
}

export interface Dialogue {
  titleEs: string;
  contextEs: string;
  lines: DialogueLine[];
  check: DialogueCheck;
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
  slang: SlangItem[];
  dialogue: Dialogue;
  writingPrompts: WritingPrompt[];
}

export type ActivityKind =
  | "presentation"
  | "slang"
  | "dialogue"
  | "listening"
  | "speaking"
  | "writing"
  | "results";

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
