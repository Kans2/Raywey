# Rayeva AI Systems 🌿

> **Role:** Full Stack / AI Intern | **Focus:** Applied AI for Sustainable Commerce

An AI-powered platform that reduces manual catalog effort, improves B2B proposal generation, automates impact reporting, and enhances customer support — built with **Node.js + Express + MongoDB** and **Google Gemini AI**.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- A free [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env → add your GEMINI_API_KEY and MONGO_URI
npm install
npm run dev
```

Backend runs at: `http://localhost:8000`
API Docs (Swagger): `http://localhost:8000/api/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🏗️ Architecture Overview

```
Raywey/
├── backend/                    ← Node.js + Express + MongoDB API
│   ├── server.js               ← Entry point (CORS, Helmet, Rate Limit, Swagger)
│   ├── config.js               ← Env-based configuration
│   ├── ai/
│   │   ├── client.js           ← Google Gemini wrapper
│   │   └── logger.js           ← Dual-sink: MongoDB + logs/ai_log.jsonl
│   ├── database/
│   │   ├── db.js               ← Mongoose connection
│   │   └── models.js           ← Mongoose schemas (ProductCatalog, B2BProposal, AiLog)
│   └── modules/
│       ├── module1_category/   ← ✅ Fully implemented
│       ├── module2_b2b/        ← ✅ Fully implemented
│       ├── module3_impact/     ← 📐 Architecture outlined
│       └── module4_whatsapp/   ← 📐 Architecture outlined
└── frontend/                   ← React + Vite
    └── src/
        ├── App.jsx
        ├── api/client.js       ← Axios API client
        └── components/
            ├── CategoryModule.jsx
            ├── ProposalModule.jsx
            ├── ArchitectureModule.jsx
            └── JsonViewer.jsx
```

---

## 📦 Modules Implemented

### ✅ Module 1 – AI Auto-Category & Tag Generator

**Endpoint:** `POST /api/v1/categorize`

**Input:**
```json
{ "product_name": "Bamboo Water Bottle", "description": "Eco-friendly reusable bottle" }
```

**Output:**
```json
{
  "id": "665a...",
  "primary_category": "Eco & Sustainable Goods",
  "sub_category": "Reusable Drinkware",
  "seo_tags": ["bamboo-water-bottle", "eco-friendly", "reusable", "plastic-free", "sustainable"],
  "sustainability_filters": ["plastic-free", "biodegradable"],
  "confidence_score": 0.96,
  "reasoning": "Bamboo material and reusability clearly place this in sustainable goods."
}
```

**Prompt Design:**
- Role-primed as a "sustainable commerce catalog manager"
- Predefined category list is injected as a hard constraint — the model cannot hallucinate categories
- Confidence score enables downstream quality filtering
- JSON-only output instruction prevents prose contamination

---

### ✅ Module 2 – AI B2B Proposal Generator

**Endpoint:** `POST /api/v1/proposals`

**Input:**
```json
{ "client_name": "GreenCorp", "industry": "Technology", "budget": 50000, "requirements": "Eco-friendly office supplies for 80 employees" }
```

**Output:**
```json
{
  "recommended_products": [...],
  "cost_breakdown": { "products_total": 46500, "estimated_delivery": 2000, "grand_total": 48500, "budget_remaining": 1500 },
  "impact_positioning": "By switching to this sustainable product mix, GreenCorp reduces plastic use by an estimated 12kg/month...",
  "sustainability_score": 8.5
}
```

**Prompt Design:**
- Real product catalog (with INR prices) is injected to ground AI reasoning — prevents hallucinated prices
- Budget is stated twice in the prompt as a hard constraint
- AI only generates the narrative (impact_positioning); numbers are constraint-checked by business logic

---

## 📐 Modules Outlined

### Module 3 – AI Impact Reporting Generator
See: [`ARCHITECTURE.md`](backend/modules/module3_impact/ARCHITECTURE.md) for full architecture doc.
- Rule-based computation of `plastic_saved_g`, `carbon_avoided_kg`, `local_sourcing_pct`
- AI generates only the human-readable narrative (grounded in computed numbers)

### Module 4 – AI WhatsApp Support Bot
See: [`ARCHITECTURE.md`](backend/modules/module4_whatsapp/ARCHITECTURE.md) for full architecture doc.
- Two-step AI: intent classification → grounded response generation
- Escalation triggered by keywords (`refund`, `fraud`, etc.) or session length

---

## ⚙️ Technical Requirements Met

| Requirement | Implementation |
|-------------|----------------|
| Structured JSON outputs | All endpoints return validated JSON via Zod schemas |
| Prompt + response logging | Dual-sink: MongoDB `AiLog` collection + `logs/ai_log.jsonl` |
| Environment-based API key | `config.js` reads from `.env` via `dotenv` |
| Clear separation of AI and business logic | `ai/client.js` (AI) ↔ `modules/*/service.js` (business) |
| Error handling and validation | Zod input validation + global Express error handler |

### Additional Features
- **MongoDB Atlas** cloud database via Mongoose ODM
- **Swagger UI** API documentation at `/api/docs`
- **Rate limiting** via `express-rate-limit` (60 req/15min)
- **Security headers** via `helmet`
- **HTTP request logging** via `morgan`
- **React dashboard** with animated tab navigation

---

## 🧪 Test the API

```bash
# Health check
curl http://localhost:8000/health

# Module 1 – Categorize a product
curl -X POST http://localhost:8000/api/v1/categorize \
  -H "Content-Type: application/json" \
  -d '{"product_name": "Bamboo Toothbrush", "description": "Eco toothbrush with bamboo handle"}'

# Module 2 – Generate B2B proposal
curl -X POST http://localhost:8000/api/v1/proposals \
  -H "Content-Type: application/json" \
  -d '{"client_name": "TechNova", "industry": "Technology", "budget": 75000, "requirements": "Zero-waste office setup for 100 employees"}'
```

---

## 📊 Evaluation Criteria

| Criteria | Implementation |
|----------|----------------|
| **Structured AI Outputs (20%)** | Strict JSON schema, Zod validation, business-logic sanitization |
| **Business Logic Grounding (20%)** | Predefined category lists, real price catalogs, budget hard constraints |
| **Clean Architecture (20%)** | Layered: `router → service → ai/client`, no AI logic in routes |
| **Practical Usefulness (20%)** | Real-world prompts, history retrieval, Swagger docs, React dashboard |
| **Creativity & Reasoning (20%)** | Confidence scores, impact positioning, sustainability scoring, architecture outlines |