// src/components/ArchitectureModule.jsx – Modules 3 & 4 Architecture Overview
import { motion } from "framer-motion";

const modules = [
    {
        num: 3,
        icon: "🌿",
        title: "AI Impact Reporting Generator",
        status: "Architecture Outlined",
        statusType: "outline",
        description: "Generates human-readable environmental impact reports per order, estimating plastic saved, carbon avoided, and local sourcing impact.",
        steps: [
            "Fetch order line items from DB",
            "Compute rule-based estimates: plastic_saved_g, carbon_avoided_kg",
            "Build prompt with computed numbers → Groq writes narrative",
            "Store ImpactReport JSON alongside order in DB",
        ],
        endpoints: ["POST /api/v1/impact/:orderId", "GET /api/v1/impact/:orderId", "GET /api/v1/impact"],
        outputs: ["plastic_saved_grams", "carbon_avoided_kg", "local_sourcing_pct", "human_readable_statement"],
    },
    {
        num: 4,
        icon: "💬",
        title: "AI WhatsApp Support Bot",
        status: "Architecture Outlined",
        statusType: "outline",
        description: "Conversational AI bot answering order status, return policies, and escalating high-priority issues via WhatsApp Cloud API.",
        steps: [
            "Receive webhook from Meta WhatsApp Cloud API",
            "Intent classification via Groq: ORDER_STATUS | RETURN_POLICY | ESCALATE",
            "Business logic router: query DB for order data, retrieve policy",
            "Response generation grounded in real DB data, log conversation",
        ],
        endpoints: ["POST /api/v1/whatsapp/webhook", "GET /api/v1/whatsapp/webhook", "GET /api/v1/whatsapp/logs"],
        outputs: ["intent_classification", "grounded_response", "escalation_flag", "conversation_log"],
    },
];

const implemented = [
    {
        num: 1, icon: "🏷️", title: "AI Auto-Category & Tag Generator", status: "Fully Implemented", statusType: "active",
        description: "Auto-assigns primary category, sub-category, 5-10 SEO tags, and sustainability filters for any product.",
        endpoints: ["POST /api/v1/categorize", "GET /api/v1/categorize", "GET /api/v1/categorize/:id"],
        outputs: ["primary_category", "sub_category", "seo_tags[5-10]", "sustainability_filters", "confidence_score"],
    },
    {
        num: 2, icon: "📋", title: "AI B2B Proposal Generator", status: "Fully Implemented", statusType: "active",
        description: "Generates sustainable product mix, budget allocation, cost breakdown, and impact positioning for B2B clients.",
        endpoints: ["POST /api/v1/proposals", "GET /api/v1/proposals", "GET /api/v1/proposals/:id"],
        outputs: ["recommended_products", "cost_breakdown", "impact_positioning", "sustainability_score"],
    },
];

export default function ArchitectureModule() {
    return (
        <div>
            <div className="section-header">
                <div>
                    <div className="section-title">System Architecture</div>
                    <div className="section-subtitle">All 4 modules — 2 fully implemented, 2 outlined</div>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-title" style={{ marginBottom: 16 }}>⚙️ Technical Stack</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                    {[
                        { icon: "🟢", label: "Runtime", value: "Node.js + Express" },
                        { icon: "🤖", label: "AI Model", value: "Groq Llama 3" },
                        { icon: "🗄️", label: "Database", value: "SQLite (better-sqlite3)" },
                        { icon: "⚛️", label: "Frontend", value: "React + Vite" },
                        { icon: "🛡️", label: "Security", value: "Helmet + Rate Limiting" },
                        { icon: "📖", label: "API Docs", value: "Swagger UI" },
                        { icon: "📊", label: "Logging", value: "Morgan + JSONL file" },
                        { icon: "✅", label: "Validation", value: "Zod schemas" },
                    ].map(({ icon, label, value }) => (
                        <div key={label} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 10 }}>
                            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Logging Architecture */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-title" style={{ marginBottom: 8 }}>🔄 AI Pipeline (All Modules)</div>
                <div style={{ display: "flex", gap: 0, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
                    {["Input Validation (Zod)", "Prompt Building", "Groq AI Call", "JSON Parse + Sanitize", "DB Persist", "Log to JSONL"].map((step, i, arr) => (
                        <div key={step} style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ padding: "8px 14px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, fontSize: 12, color: "var(--accent-primary)", fontWeight: 600, whiteSpace: "nowrap" }}>
                                {step}
                            </div>
                            {i < arr.length - 1 && <div style={{ color: "var(--text-muted)", padding: "0 6px", fontSize: 16 }}>→</div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="arch-grid" style={{ marginBottom: 24 }}>
                {implemented.map((m, idx) => (
                    <motion.div key={m.num} className="arch-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <div className="arch-status active">✅ {m.status}</div>
                        <div className="card-title">{m.icon} Module {m.num}: {m.title}</div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>{m.description}</p>
                        <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Endpoints</p>
                            {m.endpoints.map(e => <div key={e} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--accent-secondary)", marginBottom: 4 }}>{e}</div>)}
                        </div>
                        <div>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>JSON Output Fields</p>
                            <div className="tag-row">{m.outputs.map(o => <span key={o} className="tag tag-seo">{o}</span>)}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="arch-grid">
                {modules.map((m, idx) => (
                    <motion.div key={m.num} className="arch-card outlined" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (idx + 2) * 0.1 }}>
                        <div className="arch-status outline">📐 {m.status}</div>
                        <div className="card-title">{m.icon} Module {m.num}: {m.title}</div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>{m.description}</p>
                        <div className="arch-steps">
                            <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Data Flow</p>
                            {m.steps.map((s, i) => (
                                <div key={i} className="arch-step">
                                    <div className="arch-step-num">{i + 1}</div>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Planned Endpoints</p>
                            {m.endpoints.map(e => <div key={e} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{e}</div>)}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
