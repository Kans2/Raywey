// modules/module1_category/prompts.js – Prompt engineering for AI Auto-Category & Tag Generator

export const PREDEFINED_CATEGORIES = [
    "Electronics", "Home & Garden", "Food & Beverage", "Apparel & Fashion",
    "Beauty & Personal Care", "Office Supplies", "Sports & Outdoors",
    "Toys & Games", "Pet Supplies", "Automotive", "Health & Wellness",
    "Eco & Sustainable Goods",
];

export const SUSTAINABILITY_OPTIONS = [
    "plastic-free", "compostable", "vegan", "recycled-materials", "organic",
    "biodegradable", "fair-trade", "carbon-neutral", "locally-sourced",
    "zero-waste", "energy-efficient", "cruelty-free",
];

/**
 * Build prompt for product categorization.
 * Strategy: role priming + predefined constraints + JSON-only output
 */
export function buildCategorizationPrompt(productName, description) {
    return `You are an expert sustainable commerce catalog manager for Rayeva, an eco-focused B2B marketplace.
Analyze the product and return a structured JSON categorization.

PREDEFINED CATEGORIES (primary_category MUST come from this list):
${PREDEFINED_CATEGORIES.join(", ")}

SUSTAINABILITY FILTER OPTIONS (choose all that apply):
${SUSTAINABILITY_OPTIONS.join(", ")}

PRODUCT:
- Name: ${productName}
- Description: ${description || "No description provided"}

RESPOND WITH VALID JSON ONLY. No markdown, no prose:
{
  "primary_category": "<from predefined list>",
  "sub_category": "<specific sub-category>",
  "seo_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sustainability_filters": ["filter1"],
  "confidence_score": 0.95,
  "reasoning": "<one sentence>"
}`;
}
