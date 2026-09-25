// Roti Kukus Thailand - Lightweight Offline Service Worker (v2)
// Strategi cepat + hemat memori untuk HP Android low-end:
// - App shell & aset statis: Cache First (instan, offline-ready)
// - Navigasi halaman: Network First + fallback cache/offline.html (tetap fresh saat online)
// - _next/static, icon, manifest: Stale-While-Revalidate ringan
const CACHE_NAME = 'roti-kukus-v2';
const OFFLINE_URL = '/offline.html';

const APP_SHELL = [
  '/',
  '/beranda',
  '/offline.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Abaikan non-http(s) dan API eksternal
  if (!url.protocol.startsWith('http')) return;
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ offline: true }), {
            headers: { 'Content-Type': 'application/json' },
          })
      )
    );
    return;
  }

  // 1. Navigasi halaman: Network First, fallback cache -> offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const shell = await caches.match('/beranda');
          if (shell) return shell;
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // 2. Aset statis Next.js / icon / manifest: Cache First (paling kencang)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Revalidate diam-diam tanpa menghambat render
          fetch(request)
            .then((res) => {
              if (res && res.status === 200) {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(request, copy));
              }
            })
            .catch(() => undefined);
          return cached;
        }
        return fetch(request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // 3. Default: Stale-While-Revalidate ringan
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res && res.status === 200 && url.origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        })
    )
  );
});
