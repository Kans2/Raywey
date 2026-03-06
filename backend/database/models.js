// database/models.js – Mongoose schemas for Rayeva AI Systems
import mongoose from "mongoose";

// ── Module 1: Product Catalog ──────────────────────────────────────────────
const productCatalogSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, default: "" },
    primaryCategory: { type: String },
    subCategory: { type: String },
    seoTags: { type: [String], default: [] },
    sustainabilityFilters: { type: [String], default: [] },
    confidenceScore: { type: Number },
    fullResult: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const ProductCatalog = mongoose.model("ProductCatalog", productCatalogSchema);

// ── Module 2: B2B Proposals ────────────────────────────────────────────────
const b2bProposalSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    industry: { type: String },
    budget: { type: Number, required: true },
    requirements: { type: String },
    recommendedProducts: { type: [mongoose.Schema.Types.Mixed], default: [] },
    costBreakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
    impactPositioning: { type: String },
    sustainabilityScore: { type: Number },
    fullResult: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const B2BProposal = mongoose.model("B2BProposal", b2bProposalSchema);

// ── AI Prompt/Response Log ─────────────────────────────────────────────────
const aiLogSchema = new mongoose.Schema({
    module: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String },
    durationMs: { type: Number },
    success: { type: Boolean, default: true },
    errorMessage: { type: String },
}, { timestamps: true });

export const AiLog = mongoose.model("AiLog", aiLogSchema);
