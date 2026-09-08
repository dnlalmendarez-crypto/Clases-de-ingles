import type { UserLevel } from "../types";
import { similarityScore } from "./textDistance";

export interface CorrectionResult {
  isCorrect: boolean;
  correctedText: string;
  explanation: string;
  encouragement: string;
}

export interface SpeakFeedbackResult {
  isGood: boolean;
  tip: string;
  encouragement: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function localCorrection(expected: string, studentAnswer: string): CorrectionResult {
  const score = similarityScore(expected, studentAnswer);
  const isCorrect = score >= 85;
  return {
    isCorrect,
    correctedText: expected,
    explanation: isCorrect
      ? "¡Tu respuesta coincide muy bien con la esperada!"
      : `La respuesta correcta es: "${expected}". Compara palabra por palabra y vuelve a intentar.`,
    encouragement: isCorrect ? "¡Excelente trabajo!" : "¡Casi lo logras, sigue practicando!",
  };
}

/**
 * Pide a Claude (via backend) que corrija una respuesta de escritura.
 * Si el backend no está disponible o Claude no está configurado, usa una
 * comparación local para que la app siga siendo utilizable.
 */
export async function correctWriting(params: {
  prompt: string;
  expected: string;
  studentAnswer: string;
  level: UserLevel;
}): Promise<CorrectionResult> {
  const result = await postJson<CorrectionResult>("/api/correct", params);
  if (result) return result;
  return localCorrection(params.expected, params.studentAnswer);
}

function localSpeakFeedback(target: string, heard: string): SpeakFeedbackResult {
  const score = similarityScore(target, heard);
  const isGood = score >= 65;
  return {
    isGood,
    tip: isGood
      ? "Tu pronunciación se entendió bien."
      : `El micrófono entendió: "${heard || "(nada)"}". Habla más despacio y clarito, separando cada palabra.`,
    encouragement: isGood ? "¡Muy bien dicho!" : "¡Tú puedes, inténtalo otra vez!",
  };
}

export async function getSpeakFeedback(params: {
  target: string;
  heard: string;
  level: UserLevel;
}): Promise<SpeakFeedbackResult> {
  const result = await postJson<SpeakFeedbackResult>("/api/speak-feedback", params);
  if (result) return result;
  return localSpeakFeedback(params.target, params.heard);
}
