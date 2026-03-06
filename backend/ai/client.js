// ai/client.js – Groq AI wrapper (Node.js)
import Groq from "groq-sdk";
import config from "../config.js";

let groq = null;

function getClient() {
    if (!config.groqApiKey) {
        throw new Error(
            "GROQ_API_KEY is not set."
        );
    }

    if (!groq) groq = new Groq({ apiKey: config.groqApiKey });
    return groq;
}

/**
 * Send a prompt to Groq and return structured result.
 * @param {string} prompt
 * @param {string} module - caller module name for logging
 * @returns {{ text: string|null, durationMs: number, success: boolean, error: string|null }}
 */
export async function generate(prompt, module = "unknown") {
    const start = Date.now();
    let retries = 3;
    let delay = 2000; // start with 2 seconds

    while (retries > 0) {
        try {
            const client = getClient();
            const result = await client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: config.groqModel,
            });
            const text = result.choices[0]?.message?.content || "";
            return { text, durationMs: Date.now() - start, success: true, error: null };
        } catch (err) {
            // Check if it's a 429 error
            if ((err.status === 429 || (err.message && err.message.includes("429"))) && retries > 1) {
                console.warn(`⚠️ Groq API 429 Rate Limit hit. Retrying in ${delay / 1000}s... (${retries - 1} retries left)`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // exponential backoff
                retries--;
                continue;
            }
            return { text: null, durationMs: Date.now() - start, success: false, error: err.message };
        }
    }
    return { text: null, durationMs: Date.now() - start, success: false, error: "Max retries exceeded" };
}
