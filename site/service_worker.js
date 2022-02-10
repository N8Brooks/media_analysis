const CACHE_NAME = "political_compass_0_0_0";

const CONTENT = [
  "icons/political_compass_x192.png",
  "icons/political_compass_x512.png",
  "icons/political_compass.ico",
  "icons/political_compass.svg",
  "models/economy_model.bin.gz",
  "models/society_model.bin.gz",
  "index.html",
  "manifest.json",
  "political_compass.js",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] installing service worker");
  event.waitUntil((async () => {
    const cacheStorage = await caches.open(CACHE_NAME);
    console.log("[Service Worker] caching service worker content");
    await cacheStorage.addAll(CONTENT);
  })());
});

self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    console.log(`[Service Worker] fetching resource: ${event.request.url}`);
    const r = await caches.match(event.request);
    if (r) {
      return r;
    }
    const response = await fetch(event.request);
    const cacheStorage = await caches.open(CACHE_NAME);
    console.log(`[Service Worker] caching new resource: ${event.request.url}`);
    cacheStorage.put(e.request, response.clone());
    return response;
  })());
});
