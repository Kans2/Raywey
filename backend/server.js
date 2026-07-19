// server.js – Express entry point for Rayeva AI Systems (Node.js + MongoDB)
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from "./config.js";
import { connectDb } from "./database/db.js";
import categoryRouter from "./modules/module1_category/router.js";
import proposalRouter from "./modules/module2_b2b/router.js";

const app = express();

// ── Security & Parsing Middleware ─────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));  // disable CSP for Swagger UI
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// ── Rate Limiting (additional feature) ───────────────────────────────────────
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: `Too many requests. Limit: ${config.rateLimit.max} per 15 minutes.` },
});
app.use("/api/", limiter);

// ── Swagger API Docs (additional feature) ────────────────────────────────────
const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Rayeva AI Systems API",
            version: "1.0.0",
            description: `
## Rayeva – AI-Powered Sustainable Commerce Platform
Built for the Rayeva AI Systems Internship Assignment.

| Module | Description | Status |
|--------|-------------|--------|
| Module 1 | AI Auto-Category & Tag Generator | ✅ Fully Implemented |
| Module 2 | AI B2B Proposal Generator | ✅ Fully Implemented |
| Module 3 | AI Impact Reporting Generator | 📐 Architecture Outlined |
| Module 4 | AI WhatsApp Support Bot | 📐 Architecture Outlined |
      `,
        },
        servers: [
            ...(process.env.PUBLIC_URL ? [{ url: process.env.PUBLIC_URL, description: "Production server" }] : []),
            { url: `http://localhost:${config.port}`, description: "Development server" },
        ],
    },
    apis: ["./modules/**/*.js"],
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { background: #0d1a2a; } .swagger-ui .topbar-wrapper img { content: url(data:,); }",
    customSiteTitle: "Rayeva AI API Docs",
}));

// ── Module Routers ────────────────────────────────────────────────────────────
app.use("/api/v1/categorize", categoryRouter);
app.use("/api/v1/proposals", proposalRouter);

// ── Health & Root ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "Rayeva AI Systems",
        version: "1.0.0",
        runtime: "Node.js + Express + MongoDB",
        uptime: Math.floor(process.uptime()),
        modules: {
            module1_category: "active",
            module2_b2b: "active",
            module3_impact: "architecture_outlined",
            module4_whatsapp: "architecture_outlined",
        },
    });
});

// ── Serve React Frontend (Production Build) ──────────────────────────────────
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Catch-all: send index.html for any non-API route (SPA client-side routing)
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // Zod validation errors
    if (err.name === "ZodError") {
        return res.status(422).json({ error: "Validation Error", details: err.errors });
    }
    // App-thrown errors with status
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error("❌ Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
(async () => {
    await connectDb();
    app.listen(config.port, () => {
        console.log(`\n🌿 Rayeva AI Systems running at http://localhost:${config.port}`);
        console.log(`📖 API Docs: http://localhost:${config.port}/api/docs`);
        console.log(`❤️  Health:  http://localhost:${config.port}/health\n`);
    });
})();

export default app;
