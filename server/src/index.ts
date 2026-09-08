import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const PORT = Number(process.env.PORT) || 8787;
const apiKey = process.env.ANTHROPIC_API_KEY;

const anthropic = apiKey ? new Anthropic({ apiKey }) : null;
const MODEL = "claude-sonnet-5";

const app = express();
app.use(cors());
app.use(express.json());

const LEVEL_LABEL: Record<string, string> = {
  nulo: "un adulto que no sabe absolutamente nada de ingles (nivel cero)",
  principiante: "un adulto principiante que conoce palabras y frases muy basicas (nivel A1)",
  basico: "un adulto con nivel basico-elemental que ya arma oraciones simples (nivel A2)",
};

function levelDescription(level: string | undefined): string {
  return LEVEL_LABEL[level ?? "nulo"] ?? LEVEL_LABEL.nulo;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, claudeConfigured: Boolean(anthropic) });
});

/**
 * Corrige un ejercicio de escritura (traduccion / oracion en ingles) y
 * explica el error en espanol, adaptado al nivel del estudiante.
 */
app.post("/api/correct", async (req, res) => {
  const { prompt, expected, studentAnswer, level } = req.body ?? {};

  if (typeof studentAnswer !== "string" || !studentAnswer.trim()) {
    res.status(400).json({ error: "studentAnswer es requerido" });
    return;
  }

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

    const textBlock = message.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";

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

    res.json(parsed);
  } catch (err) {
    console.error("Error en /api/correct:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

/**
 * Da retroalimentacion corta sobre un intento de pronunciacion, comparando
 * lo que el reconocimiento de voz del navegador transcribio contra la frase
 * objetivo.
 */
app.post("/api/speak-feedback", async (req, res) => {
  const { target, heard, level } = req.body ?? {};

  if (typeof target !== "string" || !target.trim()) {
    res.status(400).json({ error: "target es requerido" });
    return;
  }

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

    const textBlock = message.content.find((block) => block.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";

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

    res.json(parsed);
  } catch (err) {
    console.error("Error en /api/speak-feedback:", err);
    res.status(500).json({ error: "internal_error" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de Clases de Ingles escuchando en http://localhost:${PORT}`);
  if (!anthropic) {
    console.warn("ANTHROPIC_API_KEY no configurada: /api/correct y /api/speak-feedback responderan 503 y el cliente usara su modo local.");
  }
});
