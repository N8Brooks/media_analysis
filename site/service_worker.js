const CONTENT = [
  "../models/economy_model.bin",
  "../models/society_model.bin",
  "icons/political_compass_x192.png",
  "icons/political_compass_x512.png",
  "icons/political_compass.ico",
  "icons/political_compass.svg",
  "app.js",
  "index.html",
  "manifest.json",
  "political_compass.js",
];

const cacheName = new URL(location).searchParams.get("cache-name");

self.addEventListener("install", (event) => {
  console.debug("Installing service worker");
  event.waitUntil(
    (async () => {
      const cacheStorage = await caches.open(cacheName);
      console.debug("Caching service worker content");
      await cacheStorage.addAll(CONTENT);
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      console.debug(`Fetching resource: ${event.request.url}`);
      const r = await caches.match(event.request);
      if (r) {
        return r;
      }
      const response = await fetch(event.request);
      const cacheStorage = await caches.open(cacheName);
      console.debug(`Caching new resource: ${event.request.url}`);
      cacheStorage.put(event.request, response.clone());
      return response;
    })(),
  );
});
