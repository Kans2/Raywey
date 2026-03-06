// modules/module2_b2b/prompts.js – B2B Proposal Generator prompt engineering
export const SUSTAINABLE_PRODUCT_CATALOG = [
    { name: "Recycled Paper Notebooks (Pack of 50)", unitPrice: 120, category: "Office Supplies", sustainability: ["recycled-materials", "plastic-free"] },
    { name: "Bamboo Desk Organiser Set", unitPrice: 450, category: "Office Supplies", sustainability: ["plastic-free", "biodegradable"] },
    { name: "Solar-Powered LED Desk Lamp", unitPrice: 1800, category: "Electronics", sustainability: ["energy-efficient", "carbon-neutral"] },
    { name: "Compostable Coffee Pods (Box of 100)", unitPrice: 800, category: "Food & Beverage", sustainability: ["compostable", "organic"] },
    { name: "Organic Cotton Tote Bags (Pack of 25)", unitPrice: 950, category: "Apparel & Fashion", sustainability: ["organic", "fair-trade", "plastic-free"] },
    { name: "Stainless Steel Refillable Water Bottles (Pack of 10)", unitPrice: 2200, category: "Eco & Sustainable Goods", sustainability: ["plastic-free", "zero-waste"] },
    { name: "Biodegradable Cleaning Kit", unitPrice: 350, category: "Home & Garden", sustainability: ["biodegradable", "vegan", "plastic-free"] },
    { name: "Plant-Based Hand Sanitiser (Carton of 24)", unitPrice: 600, category: "Health & Wellness", sustainability: ["vegan", "cruelty-free", "organic"] },
    { name: "Recycled Plastic Outdoor Furniture Set", unitPrice: 12000, category: "Home & Garden", sustainability: ["recycled-materials"] },
    { name: "Carbon-Neutral Shipping Packaging Kit", unitPrice: 400, category: "Eco & Sustainable Goods", sustainability: ["carbon-neutral", "recycled-materials", "compostable"] },
    { name: "Fair-Trade Organic Tea Hamper", unitPrice: 1500, category: "Food & Beverage", sustainability: ["fair-trade", "organic"] },
    { name: "Energy-Efficient Smart Power Strip", unitPrice: 3200, category: "Electronics", sustainability: ["energy-efficient"] },
];

export function buildProposalPrompt({ clientName, industry, budget, requirements, numProducts = 5 }) {
    const catalogStr = SUSTAINABLE_PRODUCT_CATALOG
        .map(p => `  - ${p.name}: ₹${p.unitPrice.toLocaleString("en-IN")} | Tags: ${p.sustainability.join(", ")}`)
        .join("\n");

    return `You are a senior sustainability consultant at Rayeva, a B2B eco-commerce platform (India).
Generate a professional sustainable product proposal for this client.

CLIENT BRIEF:
- Client Name: ${clientName}
- Industry: ${industry}
- Total Budget: ₹${budget.toLocaleString("en-IN")}
- Requirements: ${requirements || "General sustainable business needs"}

AVAILABLE SUSTAINABLE PRODUCT CATALOG (prices in INR):
${catalogStr}

TASK:
1. Select ${numProducts} products from the catalog that best fit the client's industry
2. Allocate quantities so that TOTAL COST does not exceed ₹${budget.toLocaleString("en-IN")}
3. Provide quantity and cost breakdown per item
4. Write compelling impact_positioning (2-3 sentences on environmental benefits)
5. Score overall sustainability 0-10

IMPORTANT: Sum of all costs MUST be ≤ ₹${budget.toLocaleString("en-IN")}

RESPOND WITH VALID JSON ONLY. No markdown:
{
  "client_name": "${clientName}",
  "budget_total": ${budget},
  "recommended_products": [
    { "name": "...", "quantity": 10, "unit_price": 450, "total_price": 4500, "sustainability_tags": ["tag1"] }
  ],
  "cost_breakdown": {
    "products_total": 45000,
    "estimated_delivery": 2000,
    "grand_total": 47000,
    "budget_remaining": 3000
  },
  "impact_positioning": "By choosing this sustainable product mix...",
  "sustainability_score": 8.5,
  "summary": "One-sentence executive summary."
}`;
}
