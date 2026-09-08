import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MODEL, extractText, getAnthropicClient, levelDescription } from "./_shared";

/**
 * Da retroalimentacion corta sobre un intento de pronunciacion, comparando
 * lo que el reconocimiento de voz del navegador transcribio contra la frase
 * objetivo.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const { target, heard, level } = req.body ?? {};

  if (typeof target !== "string" || !target.trim()) {
    res.status(400).json({ error: "target es requerido" });
    return;
  }

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    res.status(503).json({ error: "claude_not_configured" });
    return;
  }

  try {
    const system = `Eres un profesor de pronunciacion de ingles, calido y directo, para un adulto salvadoreno que es ${levelDescription(level)}. Le hablas en espanol sencillo. Responde SIEMPRE en JSON valido, sin texto adicional:
{"isGood": boolean, "tip": string, "encouragement": string}
- "tip": UN consejo practico y muy breve (maximo 2 oraciones) para mejorar la pronunciacion de la frase objetivo, comparando con lo que el microfono capto. Si el microfono no entendio nada o el resultado es muy distinto, sugierele hablar mas despacio y claro.
- "encouragement": frase corta y motivadora en espanol.`;

    const userMsg = `Frase objetivo en ingles: "${target}"
Lo que el reconocimiento de voz entendio: "${heard ?? "(no se entendio nada)"}"`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 250,
      system,
      messages: [{ role: "user", content: userMsg }],
    });

    const raw = extractText(message);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        isGood: false,
        tip: raw.slice(0, 300),
        encouragement: "¡Vas muy bien, sigue intentando!",
      };
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Error en /api/speak-feedback:", err);
    res.status(500).json({ error: "internal_error" });
  }
}
