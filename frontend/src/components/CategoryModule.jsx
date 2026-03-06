// src/components/CategoryModule.jsx – Module 1: AI Auto-Category & Tag Generator
import { useState } from "react";
import { motion } from "framer-motion";
import { categorizeProduct, listProducts } from "../api/client";
import JsonViewer from "./JsonViewer";

export default function CategoryModule() {
    const [form, setForm] = useState({ product_name: "", description: "" });
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
            const res = await categorizeProduct(form);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await listProducts(20, 0);
            setHistory(res.data.items || []);
            setShowHistory(true);
        } catch (err) {
            setError("Could not load history: " + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div className="module-grid">
            {/* ── LEFT: Input Form ── */}
            <div className="card">
                <div className="card-title">
                    <span>🏷️</span> Product Categorizer
                </div>
                <p className="card-desc">
                    Enter a product name and description. The AI assigns a category, sub-category,
                    5–10 SEO tags, and detects sustainability filters.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input
                            className="form-input"
                            placeholder="e.g. Bamboo Water Bottle"
                            value={form.product_name}
                            onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Product Description</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Describe the product, materials, intended use..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                        />
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? (
                            <><div className="spinner" /> Analyzing with AI...</>
                        ) : (
                            <><span>✨</span> Generate Categories & Tags</>
                        )}
                    </button>
                </form>

                <button
                    className="btn"
                    onClick={loadHistory}
                    style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontSize: 13 }}
                >
                    📋 View Past Results
                </button>

                {/* Try examples */}
                <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Try an example:</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[
                            { name: "Bamboo Toothbrush", desc: "Eco-friendly toothbrush with bamboo handle and plant-based bristles." },
                            { name: "Solar Desk Lamp", desc: "Rechargeable LED lamp powered by solar panel, energy efficient." },
                            { name: "Organic Coffee Pods", desc: "100% organic compostable coffee pods, fair-trade certified." },
                        ].map((ex) => (
                            <button
                                key={ex.name}
                                className="tag tag-seo"
                                onClick={() => setForm({ product_name: ex.name, description: ex.desc })}
                                style={{ cursor: "pointer", padding: "6px 12px" }}
                            >
                                {ex.name}
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
                                <div className="result-title">{result.product_name}</div>
                                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>ID: #{result.id} · {new Date(result.created_at).toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="metric-grid">
                            <div className="metric-item">
                                <div className="metric-value">{Math.round((result.confidence_score || 0) * 100)}%</div>
                                <div className="metric-label">Confidence</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value">{(result.seo_tags || []).length}</div>
                                <div className="metric-label">SEO Tags</div>
                            </div>
                            <div className="metric-item">
                                <div className="metric-value">{(result.sustainability_filters || []).length}</div>
                                <div className="metric-label">Eco Filters</div>
                            </div>
                        </div>

                        <div className="confidence-bar-wrap">
                            <div className="confidence-bar-label">
                                <span>AI Confidence Score</span>
                                <span style={{ color: "var(--accent-primary)", fontWeight: 700 }}>{Math.round((result.confidence_score || 0) * 100)}%</span>
                            </div>
                            <div className="confidence-bar-track">
                                <div className="confidence-bar-fill" style={{ width: `${(result.confidence_score || 0) * 100}%` }} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Categories</p>
                            <div className="tag-row">
                                <span className="tag tag-category">📁 {result.primary_category}</span>
                                {result.sub_category && <span className="tag tag-seo">↳ {result.sub_category}</span>}
                            </div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>SEO Tags</p>
                            <div className="tag-row">
                                {(result.seo_tags || []).map((tag) => <span key={tag} className="tag tag-seo">{tag}</span>)}
                            </div>
                        </div>

                        {(result.sustainability_filters || []).length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>🌿 Sustainability Filters</p>
                                <div className="tag-row">
                                    {(result.sustainability_filters || []).map((f) => <span key={f} className="tag tag-eco">♻️ {f}</span>)}
                                </div>
                            </div>
                        )}

                        {result.reasoning && (
                            <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, marginBottom: 14, fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>
                                💡 {result.reasoning}
                            </div>
                        )}

                        <details style={{ marginTop: 12 }}>
                            <summary style={{ fontSize: 12, color: "var(--text-muted)", cursor: "pointer", marginBottom: 8 }}>View Raw JSON Output</summary>
                            <JsonViewer data={result} />
                        </details>
                    </motion.div>
                )}

                {showHistory && history.length > 0 && !result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Past Categorizations</p>
                        <div className="history-list">
                            {history.map((item) => (
                                <div className="history-item" key={item.id} onClick={() => setResult(item)}>
                                    <div className="history-item-name">🏷️ {item.product_name}</div>
                                    <div className="history-item-meta">
                                        {item.primary_category} → {item.sub_category} · {(item.seo_tags || []).length} tags · {Math.round((item.confidence_score || 0) * 100)}% confidence
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {!result && !showHistory && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: "var(--text-muted)", gap: 12 }}>
                        <div style={{ fontSize: 48 }}>🤖</div>
                        <p style={{ fontSize: 14, textAlign: "center", maxWidth: 260 }}>
                            Submit a product to see AI-generated categories, SEO tags, and sustainability filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
