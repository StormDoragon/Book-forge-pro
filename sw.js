/*
 * sw.js - offline support. Network-first for pages and scripts so a deploy
 * is picked up on the next visit, falling back to the cache when offline.
 * Bump CACHE_VERSION when the asset list changes. Only caches that start with
 * CACHE_PREFIX are ever deleted, since other apps may share this origin.
 */
const CACHE_PREFIX = "bookforge-";
const CACHE_VERSION = `${CACHE_PREFIX}v2`;
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "site.js",
  "favicon.svg",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => {
        if (hit) return hit;
        // Only page loads fall back to the app shell; a missing script or
        // image must fail rather than be answered with HTML.
        return request.mode === "navigate" ? caches.match("index.html") : Response.error();
      }))
  );
});
