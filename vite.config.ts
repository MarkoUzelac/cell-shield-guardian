import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Root-relative asset URLs work on Apache, Nginx, cPanel and static CDNs.
    assetsDir: "assets",
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split heavy, rarely-changing libraries so the first paint stays small
        // and returning visitors keep them cached across deploys.
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-leaflet") || id.includes("/leaflet")) return "vendor-map";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("i18next")) return "vendor-i18n";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("react-dom") || id.includes("/react/")) return "vendor-react";
          return "vendor";
        },
      },
    },
  },
}));
