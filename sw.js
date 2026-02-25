const CACHE_VERSION = "DTI-V1.0";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/assets/img/mapa_col_00.jpg",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches
          .open(STATIC_CACHE)
          .then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
