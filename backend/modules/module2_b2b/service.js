// modules/module2_b2b/service.js – Business logic for B2B Proposal Generator
import { generate } from "../../ai/client.js";
import { logAiInteraction } from "../../ai/logger.js";
import { B2BProposal } from "../../database/models.js";
import { buildProposalPrompt } from "./prompts.js";

const MIN_BUDGET = 1000;
const MAX_BUDGET = 10_000_000;

export async function generateProposal({ clientName, industry, budget, requirements }) {
    // ── 1. Validate ──────────────────────────────────────────
    clientName = (clientName || "").trim();
    if (!clientName) throw { status: 422, message: "client_name is required." };
    if (budget < MIN_BUDGET) throw { status: 422, message: `Budget must be ≥ ₹${MIN_BUDGET.toLocaleString("en-IN")}.` };
    if (budget > MAX_BUDGET) throw { status: 422, message: `Budget must be ≤ ₹${MAX_BUDGET.toLocaleString("en-IN")}.` };

    // ── 2. Build prompt ──────────────────────────────────────
    const prompt = buildProposalPrompt({ clientName, industry: industry || "General", budget, requirements });

    // ── 3. AI call ───────────────────────────────────────────
    const aiRes = await generate(prompt, "module2_b2b");

    // ── 4. Log ───────────────────────────────────────────────
    logAiInteraction({
        module: "module2_b2b",
        prompt,
        responseText: aiRes.text,
        durationMs: aiRes.durationMs,
        success: aiRes.success,
        errorMessage: aiRes.error,
    });

    if (!aiRes.success) throw { status: 502, message: `AI call failed: ${aiRes.error}` };

    // ── 5. Parse + validate ──────────────────────────────────
    const result = parseJson(aiRes.text);
    sanitize(result, budget);

    // ── 6. Store in MongoDB ──────────────────────────────────
    const doc = await B2BProposal.create({
        clientName,
        industry,
        budget,
        requirements,
        recommendedProducts: result.recommended_products || [],
        costBreakdown: result.cost_breakdown || {},
        impactPositioning: result.impact_positioning,
        sustainabilityScore: result.sustainability_score,
        fullResult: result,
    });

    return { id: doc._id, ...result, created_at: doc.createdAt };
}

export async function getProposalById(id) {
    const doc = await B2BProposal.findById(id).lean();
    return doc ? docToObj(doc) : null;
}

export async function listProposals({ limit = 20, offset = 0 } = {}) {
    const [items, total] = await Promise.all([
        B2BProposal.find().sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
        B2BProposal.countDocuments(),
    ]);
    return { total, items: items.map(docToObj) };
}

function parseJson(text) {
    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw { status: 502, message: "AI did not return valid JSON." };
    try { return JSON.parse(match[0]); }
    catch (e) { throw { status: 502, message: `JSON parse failed: ${e.message}` }; }
}

function sanitize(r, budget) {
    r.sustainability_score = Math.max(0, Math.min(10, parseFloat(r.sustainability_score) || 0));
    if (!Array.isArray(r.recommended_products)) r.recommended_products = [];
    const breakdown = r.cost_breakdown || {};
    if (breakdown.grand_total > budget) {
        r.budget_warning = `AI-generated total ₹${breakdown.grand_total?.toLocaleString("en-IN")} exceeds budget ₹${budget.toLocaleString("en-IN")}. Review quantities.`;
    }
}

function docToObj(doc) {
    return {
        id: doc._id,
        client_name: doc.clientName,
        industry: doc.industry,
        budget: doc.budget,
        requirements: doc.requirements,
        recommended_products: doc.recommendedProducts || [],
        cost_breakdown: doc.costBreakdown || {},
        impact_positioning: doc.impactPositioning,
        sustainability_score: doc.sustainabilityScore,
        full_result: doc.fullResult || {},
        created_at: doc.createdAt,
    };
}
