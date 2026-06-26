const VERSION = 'ai-flight-lab-release-media-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const MAX_RUNTIME_ENTRIES = 80;

const scopeUrl = self.registration ? self.registration.scope : `${self.location.origin}/`;
const shellAssets = ['.', 'offline.html', 'favicon.svg', 'manifest.webmanifest'].map((path) =>
  new URL(path, scopeUrl).toString(),
);

function isMediaRequest(url) {
  return (
    url.pathname.includes('/media/') ||
    url.pathname.includes('/videos/') ||
    url.pathname.includes('/releases/download/') ||
    /\.(mp4|m4v|mov|webm|avi|mkv)$/i.test(url.pathname)
  );
}

function isCacheableRequest(request, url) {
  if (request.method !== 'GET') return false;
  if (url.origin !== self.location.origin) return false;
  if (isMediaRequest(url)) return false;

  return /\.(html|js|css|json|webmanifest|svg|png|jpg|jpeg|webp|pdf|woff2?)$/i.test(url.pathname);
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;

  await cache.delete(keys[0]);
  await trimCache(cacheName, maxEntries);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(shellAssets))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('ai-flight-lab-') && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (isMediaRequest(url)) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? caches.match(new URL('offline.html', scopeUrl).toString());
        }),
    );
    return;
  }

  if (!isCacheableRequest(request, url)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchAndCache = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, copy);
              trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES);
            });
          }
          return response;
        })
        .catch(() => cached);

      return cached ?? fetchAndCache;
    }),
  );
});
