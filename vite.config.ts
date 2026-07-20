import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "brotliCompress",
      disable: false,
    }),
  ],
  build: {
    // Strip debug noise from the production bundle (there were ~38 console.* calls).
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Only pull out the vendors that EVERY route needs, so they stay cached
        // across deploys. Everything else is left to Rollup, which keeps a
        // route-only library (quill, highlight.js...) inside that route's lazy
        // chunk — bucketing all of node_modules into one "vendor" would instead
        // force every page to download libraries it never uses.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("@tanstack")) return "vendor-query";
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/scheduler/")
          )
            return "vendor-react";
        },
      },
    },
  },
});
