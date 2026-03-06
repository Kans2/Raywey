// src/App.jsx – Main Rayeva AI Systems dashboard
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryModule from "./components/CategoryModule";
import ProposalModule from "./components/ProposalModule";
import ArchitectureModule from "./components/ArchitectureModule";
import "./index.css";

const TABS = [
  { id: "category", label: "Auto-Category & Tags", icon: "🏷️", badge: "Module 1" },
  { id: "proposal", label: "B2B Proposal", icon: "📋", badge: "Module 2" },
  { id: "architecture", label: "Architecture", icon: "🏗️", badge: "Modules 3 & 4" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("category");

  return (
    <>
      {/* ── Header ── */}
      <header className="header">
        <div className="app-container">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">🌿</div>
              <div className="logo-text">
                <h1>Rayeva AI Systems</h1>
                <p>Applied AI for Sustainable Commerce</p>
              </div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.02em' }}>
              Built by <strong style={{ color: 'var(--accent-primary)' }}>Kannan S</strong>
            </span>
            <div className="header-badge">
              <div className="status-dot" />
              Node.js + Groq
            </div>
          </div>

          {/* ── Tab Navigation ── */}
          <nav className="tab-nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                {tab.label}
                <span className="tab-badge">{tab.badge}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="main-content">
        <div className="app-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "category" && <CategoryModule />}
              {activeTab === "proposal" && <ProposalModule />}
              {activeTab === "architecture" && <ArchitectureModule />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 0", marginTop: "auto" }}>
        <div className="app-container" style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
          <span>🌿 Rayeva AI Systems</span>
          <span style={{ margin: "0 12px" }}>·</span>
          <a href="http://localhost:8000/api/docs" target="_blank" rel="noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>API Docs (Swagger)</a>
          <span style={{ margin: "0 12px" }}>·</span>
          <a href="http://localhost:8000/health" target="_blank" rel="noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>Health Check</a>
          <span style={{ margin: "0 12px" }}>·</span>
          <span>Built by <strong>Kannan S</strong></span>
        </div>
      </footer>
    </>
  );
}
