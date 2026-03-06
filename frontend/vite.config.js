import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api/* → Express backend (avoids CORS in dev)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
