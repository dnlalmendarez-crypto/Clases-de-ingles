import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MODEL, extractText, getAnthropicClient, levelDescription } from "./_shared";

/**
 * Corrige un ejercicio de escritura (traduccion / oracion en ingles) y
 * explica el error en espanol, adaptado al nivel del estudiante.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { prompt, expected, studentAnswer, level } = req.body ?? {};

  if (typeof studentAnswer !== "string" || !studentAnswer.trim()) {
    res.status(400).json({ error: "studentAnswer es requerido" });
    return;
  }

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    res.status(503).json({ error: "claude_not_configured" });
    return;
  }

  try {
    const system = `Eres un profesor de ingles paciente y calido para adultos salvadorenos que estan aprendiendo ingles desde cero. Le hablas siempre en espanol centroamericano, con frases cortas y sencillas, nunca con tecnicismos de gramatica innecesarios. Tu estudiante es ${levelDescription(level)}. Responde SIEMPRE en JSON valido, sin texto adicional, con este formato exacto:
{"isCorrect": boolean, "correctedText": string, "explanation": string, "encouragement": string}
- "correctedText": la version correcta en ingles (si ya estaba correcta, repitela).
- "explanation": explica en espanol, en 1-2 oraciones muy simples, por que estaba mal (o que hizo bien si estaba bien).
- "encouragement": una frase corta y motivadora en espanol.`;

    const userMsg = `Ejercicio: "${prompt ?? ""}"
Respuesta esperada (referencia): "${expected ?? ""}"
Respuesta del estudiante: "${studentAnswer}"`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: userMsg }],
    });

    const raw = extractText(message);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        isCorrect: false,
        correctedText: expected ?? studentAnswer,
        explanation: raw.slice(0, 300),
        encouragement: "¡Sigue practicando!",
      };
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Error en /api/correct:", err);
    res.status(500).json({ error: "internal_error" });
  }
}
