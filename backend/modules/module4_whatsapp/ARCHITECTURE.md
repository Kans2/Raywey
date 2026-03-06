# Module 4 – AI WhatsApp Support Bot

> **STATUS:** Architecture Outline (not fully implemented)

## Purpose

A conversational AI bot that answers customer queries via WhatsApp about order status, return policies, and escalates issues when needed.

## Architecture Overview

```
WhatsApp Cloud API (Meta)
     │  (webhook POST)
     ▼
whatsapp/router.js::webhookHandler(message)
     │
     ├── 1. Parse incoming message (customer phone + text)
     ├── 2. Intent Classification (AI call):
     │       "ORDER_STATUS" | "RETURN_POLICY" | "ESCALATE" | "OTHER"
     │
     ├── 3. Business Logic Router (based on intent):
     │       ORDER_STATUS  → query Orders DB by phone number
     │       RETURN_POLICY → retrieve policy from static store
     │       ESCALATE      → flag conversation + notify support team
     │
     ├── 4. Build contextual response via Groq:
     │       "Given order data: {...}, answer the customer query..."
     │
     ├── 5. Log full conversation to AiLog collection
     └── 6. Send response via WhatsApp Cloud API
```

## Data Model

```js
// Mongoose Schema
{
  sessionId:      String,
  customerPhone:  String,
  messageIn:      String,
  intent:         String,      // ORDER_STATUS | RETURN_POLICY | ESCALATE | OTHER
  messageOut:     String,      // ← AI-generated
  escalated:      Boolean,
  timestamps:     true
}
```

## AI Prompt Strategy

**Two prompts per interaction:**
1. **Intent classification** → returns one of 4 intents (fast, cheap)
2. **Response generation** → grounded in real DB data, brand tone

## Escalation Logic (business, not AI)

Triggers escalation if:
- **Keywords:** `refund`, `legal`, `fraud`, `broken`, `complaint`
- Customer message count in session > 5 with no resolution
- Intent is `ESCALATE`

## Return Policy (static, stored in config)

- 7-day return window for most products
- Non-returnable: perishables, customised items
- Refund timeline: 5–7 business days

## WhatsApp Integration

- **Webhook:** `META_WEBHOOK_VERIFY_TOKEN` (env var)
- **Send API:** `META_WHATSAPP_TOKEN` + `META_PHONE_NUMBER_ID` (env vars)
- **Endpoint:** `https://graph.facebook.com/v18.0/{phone_id}/messages`

## REST Endpoints (to implement)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/whatsapp/webhook` | Receive WhatsApp messages |
| `GET` | `/api/v1/whatsapp/webhook` | Meta webhook verification |
| `GET` | `/api/v1/whatsapp/logs` | List AI conversation logs |
| `POST` | `/api/v1/whatsapp/test` | Send test message (dev only) |

## Files to Create

```
modules/module4_whatsapp/
├── ARCHITECTURE.md     (this file)
├── prompts.js          (intent + response prompts)
├── intent.js           (intent classification logic)
├── policy.js           (return policy static store)
├── whatsappClient.js   (Meta Cloud API wrapper)
├── service.js          (main orchestration)
└── router.js           (Express webhook endpoints)
```
