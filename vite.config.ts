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
          // Only split libraries that are already loaded lazily by their own
          // route. React and everything that depends on it stays in one chunk
          // so module init order can never break.
          if (id.includes("react-leaflet") || id.includes("/leaflet")) return "vendor-map";
          if (id.includes("recharts") || id.includes("/d3-")) return "vendor-charts";
          return undefined;
        },
      },
    },
  },
}));
