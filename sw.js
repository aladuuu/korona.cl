const CACHE_NAME = 'korona-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './preguntas.html',
  './stock.html',
  './offline.html',
  './favicon.ico',
  './site.webmanifest',
  './assets/img/logo.webp',
  './assets/img/devolucion.webp',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/js/tailwind.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const { request } = event;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(res => res || caches.match('./offline.html'))
        )
    );
  } else {
    event.respondWith(
      caches.match(request).then(cached =>
        cached ||
        fetch(request)
          .then(response => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          })
          .catch(() => {})
      )
    );
  }
});
