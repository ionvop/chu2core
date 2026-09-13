import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Separate React (large + rarely changes) from app code for caching.
        manualChunks(id) {
          if (
            id.includes("node_modules") &&
            (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/"))
          ) {
            return "react-vendor";
          }
        },
      },
    },
  },
});