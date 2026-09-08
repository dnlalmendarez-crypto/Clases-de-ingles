import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAnthropicClient } from "./_shared";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ ok: true, claudeConfigured: Boolean(getAnthropicClient()) });
}
