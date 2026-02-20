/**
 * Anti Gravity - Service Worker (Kill Switch Version)
 * This SW immediately removes itself and all old caches.
 */

// Kill all old caches immediately on install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }),
  );
  self.skipWaiting();
});

// Claim all clients and then unregister self
self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      return self.registration.unregister();
    }),
  );
});

// Pass ALL requests directly to network - no caching at all
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
