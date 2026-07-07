const CACHE_NAME = "sige-3c-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./assets/css/styles.css",
  "./assets/js/main.js",
  "./assets/images/hero-store-bg.png",
  "./assets/images/manager.png",
  "./assets/images/black-cat.png",
  "./assets/images/white-poodle.png",
  "./assets/images/icon-192.png",
  "./assets/images/icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
