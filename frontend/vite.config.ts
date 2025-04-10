import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4005,
    proxy: {
      '/api': {
        target: 'https://intex212-dddke6d2evghbydw.eastus-01.azurewebsites.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
