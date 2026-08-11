// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://markouzelacuzy.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Mirrors the public routes declared in src/App.tsx (the "*" catch-all is excluded).
const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/capabilities", changefreq: "monthly", priority: "0.8" },
  { path: "/network", changefreq: "monthly", priority: "0.8" },
  { path: "/protection", changefreq: "monthly", priority: "0.8" },
  { path: "/metadata", changefreq: "monthly", priority: "0.7" },
  { path: "/map", changefreq: "monthly", priority: "0.6" },
  { path: "/alerts", changefreq: "monthly", priority: "0.5" },
  { path: "/demo", changefreq: "monthly", priority: "0.5" },
  { path: "/tactical", changefreq: "monthly", priority: "0.4" },
  { path: "/settings", changefreq: "yearly", priority: "0.3" },
  { path: "/about", changefreq: "yearly", priority: "0.5" },
];

function generateSitemap(items: SitemapEntry[]) {
  const urls = items.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
