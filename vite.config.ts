import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Multi-page build:
//  - index.html  → the editor app
//  - render.html → the print/PDF render target (consumed by the Node PDF server)
export default defineConfig({
  plugins: [react()],
  // Static assets live in `static/` so Vite does not mix them with app entrypoints.
  publicDir: "static",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        render: resolve(__dirname, "render.html")
      }
    }
  },
  server: {
    port: 5173,
    // Allow the dev server to delegate PDF + render to a running Node helper
    // (`npm run serve`) so PDF export can be exercised during development.
    proxy: {
      "/api": "http://127.0.0.1:4173",
      "/render": "http://127.0.0.1:4173"
    }
  }
});
