// src/components/ProposalModule.jsx – Module 2: AI B2B Proposal Generator
import { useState } from "react";
import { motion } from "framer-motion";
import { generateProposal, listProposals } from "../api/client";
import JsonViewer from "./JsonViewer";

const INDUSTRIES = [
    "Technology", "Retail", "Healthcare", "Education", "Food & Hospitality",
    "Manufacturing", "Finance", "Logistics", "Real Estate", "NGO / Non-Profit"
];

export default function ProposalModule() {
    const [form, setForm] = useState({
        client_name: "",
        industry: "Technology",
        budget: "",
        requirements: "",
    });
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const payload = { ...form, budget: parseFloat(form.budget) };
            const res = await generateProposal(payload);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await listProposals(20, 0);
            setHistory(res.data.items || []);
            setShowHistory(true);
        } catch (err) {
            setError("Could not load history: " + (err.response?.data?.detail || err.message));
        }
    };

    const formatCurrency = (val) => {
        const num = typeof val === "string" ? parseFloat(val.replace(/[^0-9.-]/g, "")) : Number(val);
        if (isNaN(num)) return "₹0";
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
    };

    return (
        <div className="module-grid">
            {/* ── LEFT: Input Form ── */}
            <div className="card">
                <div className="card-title">
                    <span>📋</span> B2B Proposal Generator
                </div>
                <p className="card-desc">
                    Enter client details and budget. The AI generates a sustainable product mix,
                    cost breakdown, and impact positioning for your B2B proposal.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Client Name *</label>
                            <input
                                className="form-input"
                                placeholder="e.g. GreenCorp Pvt Ltd"
                                value={form.client_name}
                                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Industry</label>
                            <select
                                className="form-select"
                                value={form.industry}
                                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            >
                                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Total Budget (INR) *</label>
                        <input
                            className="form-input"
                            type="number"
                            placeholder="e.g. 50000"
                            min="1000"
                            value={form.budget}
                            onChange={(e) => setForm({ ...form, budget: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Requirements</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Describe specific product needs, employee count, use case..."
                            value={form.requirements}
                            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? (
                            <><div className="spinner" /> Generating Proposal...</>
                        ) : (
                            <><span>🚀</span> Generate B2B Proposal</>
                        )}
                    </button>
                </form>

                <button
                    className="btn"
                    onClick={loadHistory}
                    style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontSize: 13 }}
                >
                    📋 View Past Proposals
                </button>

                <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Try an example:</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[
                            { client_name: "TechNova Pvt Ltd", industry: "Technology", budget: "75000", requirements: "Eco-friendly office supplies for 100 employees, focus on zero-waste." },
                            { client_name: "Harvest Foods", industry: "Food & Hospitality", budget: "30000", requirements: "Sustainable packaging and organic pantry products." },
                        ].map((ex) => (
                            <button
                                key={ex.client_name}
                                className="tag tag-seo"
                                onClick={() => setForm(ex)}
                                style={{ cursor: "pointer", padding: "6px 12px" }}
                            >
                                {ex.client_name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Results ── */}
            <div>
                {error && (
                    <div className="error-box">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {result && (
                    <motion.div
                        className="result-card"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="result-header">
                            <span style={{ fontSize: 20 }}>✅</span>
                            <div>
                                <div className="result-title">{result.client_name}</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                    ID: #{result.id} · {result.industry} · {new Date(result.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {result.budget_warning && (
                            <div className="error-box" style={{ marginBottom: 12, background: "rgba(245,158,11,0.08)", borderColor: "rgba(245,158,11,0.25)", color: "#fbbf24" }}>
                                ⚠️ {result.budget_warning}
                            </div>
                        )}

                        <div className="metric-grid">
                            <div className="metric-item">
                                <div className="metric-value" style={{ fontSize: 16 }}>{formatCurrency(result.budget)}</div>
                                <div className="metric-label">Total Budget</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value">{(result.recommended_products || []).length}</div>
                                <div className="metric-label">Products</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value">{result.sustainability_score?.toFixed(1)}/10</div>
                                <div className="metric-label">Eco Score</div>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        {result.cost_breakdown && (
                            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>💰 Cost Breakdown</p>
                                {Object.entries(result.cost_breakdown).map(([key, val]) => (
                                    <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6, color: "var(--text-secondary)" }}>
                                        <span style={{ textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                                        <span style={{ fontWeight: 600, color: key === "grand_total" ? "var(--accent-primary)" : "inherit" }}>
                                            {typeof val === "number" ? formatCurrency(val) : val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Product Table */}
                        {(result.recommended_products || []).length > 0 && (
                            <div style={{ marginBottom: 14 }}>
                                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>📦 Recommended Products</p>
                                <div style={{ overflowX: "auto" }}>
                                    <table className="product-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Unit Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(result.recommended_products || []).map((p, i) => {
                                                const total = p.total_price ?? (p.quantity * p.unit_price);
                                                return (
                                                    <tr key={i}>
                                                        <td style={{ color: "var(--text-primary)" }}>{p.name}</td>
                                                        <td>{p.quantity}</td>
                                                        <td>{formatCurrency(p.unit_price)}</td>
                                                        <td style={{ color: "var(--accent-primary)", fontWeight: 600 }}>{formatCurrency(total)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Impact Positioning */}
                        {result.impact_positioning && (
                            <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, marginBottom: 14 }}>
                                <p style={{ fontSize: 11, color: "var(--accent-primary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>🌱 Impact Positioning</p>
                                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{result.impact_positioning}</p>
                            </div>
                        )}

                        {result.summary && (
                            <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 14, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>
                                💡 {result.summary}
                            </div>
                        )}

                        <details>
                            <summary style={{ fontSize: 12, color: "var(--text-muted)", cursor: "pointer", marginBottom: 8 }}>View Raw JSON Output</summary>
                            <JsonViewer data={result} />
                        </details>
                    </motion.div>
                )}

                {showHistory && history.length > 0 && !result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Past Proposals</p>
                        <div className="history-list">
                            {history.map((item) => (
                                <div className="history-item" key={item.id} onClick={() => setResult(item)}>
                                    <div className="history-item-name">📋 {item.client_name}</div>
                                    <div className="history-item-meta">
                                        {item.industry} · Budget: ₹{item.budget?.toLocaleString("en-IN")} · Eco: {item.sustainability_score}/10
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {!result && !showHistory && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "var(--text-muted)", gap: 12 }}>
                        <div style={{ fontSize: 48 }}>📊</div>
                        <p style={{ fontSize: 14, textAlign: "center", maxWidth: 260 }}>
                            Submit client details to generate an AI-powered sustainable B2B proposal.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
