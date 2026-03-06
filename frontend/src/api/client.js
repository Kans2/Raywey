// src/api/client.js – Axios API client pointing to Express backend
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 60000, // 60s – AI calls can be slow
});

// Module 1 – Auto Category & Tags
export const categorizeProduct = (data) => API.post("/api/v1/categorize/", data);
export const listProducts = (limit = 20, offset = 0) =>
  API.get("/api/v1/categorize/", { params: { limit, offset } });

// Module 2 – B2B Proposal
export const generateProposal = (data) => API.post("/api/v1/proposals/", data);
export const listProposals = (limit = 20, offset = 0) =>
  API.get("/api/v1/proposals/", { params: { limit, offset } });

// Health
export const checkHealth = () => API.get("/health");

export default API;
