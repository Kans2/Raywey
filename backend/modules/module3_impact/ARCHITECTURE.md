# Module 3 – AI Impact Reporting Generator

> **STATUS:** Architecture Outline (not fully implemented)

## Purpose

Automatically generate human-readable environmental impact reports for each order, estimating plastic saved, carbon avoided, and local sourcing benefits.

## Architecture Overview

```
Order Data (DB)
     │
     ▼
impact/service.js::generateImpactReport(orderId)
     │
     ├── 1. Fetch order line items from DB
     ├── 2. Compute rule-based estimates (no AI needed for numerics):
     │       - plastic_saved_g = sum(product.plastic_weight_g * qty)
     │       - carbon_avoided_kg = sum(product.carbon_factor * qty)
     │       - local_sourcing_pct = products_local / total_products * 100
     │
     ├── 3. Build prompt with computed numbers → Groq
     │       "Given these impact numbers, write a 3-sentence
     │        readable summary for the customer..."
     │
     ├── 4. Parse response → ImpactReport JSON
     └── 5. Store ImpactReport alongside order in DB
```

## Data Model

```js
// Mongoose Schema
{
  orderId:               ObjectId,
  plasticSavedGrams:     Number,
  carbonAvoidedKg:       Number,
  localSourcingPct:      Number,
  humanReadableStatement: String,   // ← AI-generated
  fullResult:            Mixed,
  timestamps:            true
}
```

## AI Prompt Strategy

- Numbers are computed by **business logic** (not hallucinated by AI)
- AI is only used to write the human-readable narrative
- Prompt includes brand voice guidelines for Rayeva

## REST Endpoints (to implement)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/impact/:orderId` | Generate report for an order |
| `GET` | `/api/v1/impact/:orderId` | Retrieve existing report |
| `GET` | `/api/v1/impact` | List all impact reports |

## Sustainability Metrics (rule-based, not AI)

Products carry metadata fields:
- `plastic_weight_g` – plastic packaging per unit
- `carbon_factor_kg` – CO₂ equivalent per unit
- `is_locally_sourced` – within 500km of delivery

## Files to Create

```
modules/module3_impact/
├── ARCHITECTURE.md   (this file)
├── prompts.js        (narrative generation prompt)
├── metrics.js        (rule-based calculation engine)
├── service.js        (orchestration pipeline)
└── router.js         (Express endpoints)
```
