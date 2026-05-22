const CACHE_NAME = "cafe-v1";
// Solo mete lo básico para que no de error buscando archivos que no existen
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Instalando cache...");
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});