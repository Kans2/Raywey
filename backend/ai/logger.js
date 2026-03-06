// ai/logger.js – Dual-sink AI prompt/response logger (MongoDB + JSONL file)
import fs from "fs";
import path from "path";
import { AiLog } from "../database/models.js";

const LOG_FILE = path.resolve("logs/ai_log.jsonl");

export function logAiInteraction({ module, prompt, responseText, durationMs, success, errorMessage }) {
  // ── MongoDB log (fire-and-forget) ────────────────────────────
  AiLog.create({
    module,
    prompt,
    response: responseText ?? null,
    durationMs: durationMs ?? null,
    success: !!success,
    errorMessage: errorMessage ?? null,
  }).catch(err => console.error("⚠️ AI log DB write failed:", err.message));

  // ── JSONL file log ───────────────────────────────────────────
  fs.mkdirSync("logs", { recursive: true });
  const record = {
    timestamp: new Date().toISOString(),
    module,
    durationMs,
    success,
    promptPreview: prompt.length > 200 ? prompt.slice(0, 200) + "..." : prompt,
    responsePreview: responseText ? (responseText.length > 200 ? responseText.slice(0, 200) + "..." : responseText) : null,
    error: errorMessage ?? null,
  };
  fs.appendFileSync(LOG_FILE, JSON.stringify(record) + "\n", "utf-8");
}
