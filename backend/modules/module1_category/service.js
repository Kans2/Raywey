// modules/module1_category/service.js – Business logic for Module 1
import { generate } from "../../ai/client.js";
import { logAiInteraction } from "../../ai/logger.js";
import { ProductCatalog } from "../../database/models.js";
import { buildCategorizationPrompt, PREDEFINED_CATEGORIES } from "./prompts.js";

/**
 * Full pipeline: validate → prompt → AI → parse → validate → store → return
 */
export async function categorizeProduct({ productName, description }) {
    // ── 1. Validate ──────────────────────────────────────────
    productName = (productName || "").trim();
    if (!productName) throw { status: 422, message: "product_name is required." };
    if (productName.length > 255) throw { status: 422, message: "product_name max 255 chars." };
    description = (description || "").trim();

    // ── 2. Build prompt ──────────────────────────────────────
    const prompt = buildCategorizationPrompt(productName, description);

    // ── 3. Call AI ───────────────────────────────────────────
    const aiRes = await generate(prompt, "module1_category");

    // ── 4. Log ───────────────────────────────────────────────
    logAiInteraction({
        module: "module1_category",
        prompt,
        responseText: aiRes.text,
        durationMs: aiRes.durationMs,
        success: aiRes.success,
        errorMessage: aiRes.error,
    });

    if (!aiRes.success) {
        console.error("❌ Groq AI Error:", aiRes.error);
        throw { status: 502, message: `AI call failed: ${aiRes.error}` };
    }

    // ── 5. Parse ─────────────────────────────────────────────
    const result = parseJson(aiRes.text);

    // ── 6. Business logic validation ─────────────────────────
    sanitize(result);

    // ── 7. Store in MongoDB ──────────────────────────────────
    const doc = await ProductCatalog.create({
        productName,
        description,
        primaryCategory: result.primary_category,
        subCategory: result.sub_category,
        seoTags: result.seo_tags || [],
        sustainabilityFilters: result.sustainability_filters || [],
        confidenceScore: result.confidence_score,
        fullResult: result,
    });

    return {
        id: doc._id,
        product_name: productName,
        ...result,
        created_at: doc.createdAt,
    };
}

export async function getProductById(id) {
    const doc = await ProductCatalog.findById(id).lean();
    return doc ? docToObj(doc) : null;
}

export async function listProducts({ limit = 20, offset = 0 } = {}) {
    const [items, total] = await Promise.all([
        ProductCatalog.find().sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
        ProductCatalog.countDocuments(),
    ]);
    return { total, items: items.map(docToObj) };
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function parseJson(text) {
    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw { status: 502, message: "AI did not return valid JSON." };
    try { return JSON.parse(match[0]); }
    catch (e) { throw { status: 502, message: `JSON parse failed: ${e.message}` }; }
}

function sanitize(r) {
    r.confidence_score = Math.max(0, Math.min(1, parseFloat(r.confidence_score) || 0));
    if (!PREDEFINED_CATEGORIES.includes(r.primary_category)) r.primary_category = "Eco & Sustainable Goods";
    if (!Array.isArray(r.seo_tags)) r.seo_tags = [];
    if (!Array.isArray(r.sustainability_filters)) r.sustainability_filters = [];
    r.seo_tags = r.seo_tags.slice(0, 10);
}

function docToObj(doc) {
    return {
        id: doc._id,
        product_name: doc.productName,
        description: doc.description,
        primary_category: doc.primaryCategory,
        sub_category: doc.subCategory,
        seo_tags: doc.seoTags || [],
        sustainability_filters: doc.sustainabilityFilters || [],
        confidence_score: doc.confidenceScore,
        full_result: doc.fullResult || {},
        created_at: doc.createdAt,
    };
}
