import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4005,
    proxy: {
      // Handle all /api requests to backend
      "/api": {
        target: process.env.VITE_BACKEND_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      // Also proxy /Auth requests to backend
      "/Auth": {
        target: process.env.VITE_BACKEND_BASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
