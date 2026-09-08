import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-sonnet-5";

let cachedClient: Anthropic | null | undefined;

/** Cliente de Anthropic, o null si ANTHROPIC_API_KEY no está configurada. */
export function getAnthropicClient(): Anthropic | null {
  if (cachedClient !== undefined) return cachedClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  cachedClient = apiKey ? new Anthropic({ apiKey }) : null;
  return cachedClient;
}

const LEVEL_LABEL: Record<string, string> = {
  nulo: "un adulto que no sabe absolutamente nada de ingles (nivel cero)",
  principiante: "un adulto principiante que conoce palabras y frases muy basicas (nivel A1)",
  basico: "un adulto con nivel basico-elemental que ya arma oraciones simples (nivel A2)",
};

export function levelDescription(level: string | undefined): string {
  return LEVEL_LABEL[level ?? "nulo"] ?? LEVEL_LABEL.nulo;
}

export function extractText(message: Anthropic.Messages.Message): string {
  const block = message.content.find((b) => b.type === "text");
  return block && "text" in block ? block.text : "{}";
}
