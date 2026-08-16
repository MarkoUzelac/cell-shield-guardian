import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Offline support. Registration is guarded in
    // `src/lib/offline/registerServiceWorker.ts` so the worker never runs in
    // dev or the Lovable preview.
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      filename: "sw.js",
      devOptions: { enabled: false },
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,ico,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/~oauth/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // HTML must always try the network first so deploys land instantly.
            urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-navigations",
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: ({ sameOrigin, request }: { sameOrigin: boolean; request: Request }) =>
              sameOrigin && ["script", "style", "font", "image"].includes(request.destination),
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Map tiles: usable offline for areas already visited.
            urlPattern: ({ url }: { url: URL }) => /tile\.openstreetmap|basemaps|tiles?\./.test(url.hostname),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
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
