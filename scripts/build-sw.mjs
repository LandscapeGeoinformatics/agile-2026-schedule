import { generateSW } from "workbox-build";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const base = "/agile-2026-schedule/";

await generateSW({
  swDest: resolve(distDir, "sw.js"),
  globDirectory: distDir,
  globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,json,woff2}"],
  navigateFallback: `${base}index.html`,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "google-fonts-stylesheets" }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
      }
    }
  ]
});

console.log("Workbox service worker generated.");