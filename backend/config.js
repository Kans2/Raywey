// config.js – Environment-based configuration
import dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT || 8000,
    groqApiKey: process.env.GROQ_API_KEY || "",
    groqModel: process.env.GROQ_MODEL || "llama3-8b-8192",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/rayeva",
    logLevel: process.env.LOG_LEVEL || "info",
    allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:5173"),
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX || "60"),
    },
};

if (!config.groqApiKey) {
    console.warn("⚠️  GROQ_API_KEY not set. Copy .env.example to .env and add your key.");
}

export default config;
