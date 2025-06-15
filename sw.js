/*  Korona PWA Service-Worker  ────────────────────────────────────────── */
const CACHE_VERSION   = 'v3';                        // bump when you deploy
const STATIC_CACHE    = `korona-static-${CACHE_VERSION}`;
const RUNTIME_CACHE   = `korona-runtime-${CACHE_VERSION}`;

/* 1.  App-shell: todo lo que la app necesita para arrancar offline      */
const APP_SHELL = [
  /* páginas principales */
  './', './index.html', './preguntas.html', './stock.html',
  './offline.html',

  /* íconos y manifiesto */
  './favicon.ico', './site.webmanifest',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',

  /* estilos y scripts propios */
  './assets/css/korona.css',
  './assets/css/animate.css',
  './assets/js/tailwind.js',

  /* Font Awesome comprimido + Poppins locales */
  './assets/fontawesome/css/all.min.css',
  './assets/fontawesome/webfonts/fa-solid-900.woff2',
  './assets/fontawesome/webfonts/fa-regular-400.woff2',
  './assets/fontawesome/webfonts/fa-brands-400.woff2',
  './assets/fontawesome/webfonts/fa-v4compatibility.woff2',
  './assets/fonts/poppins/poppins-400.woff2',
  './assets/fonts/poppins/poppins-500.woff2',
  './assets/fonts/poppins/poppins-600.woff2',
  './assets/fonts/poppins/poppins-700.woff2',
  './assets/fonts/poppins/poppins-900.woff2',

  /* imágenes “críticas” que siempre mostramos */
  './assets/img/logo.webp',
  './assets/img/devolucion.webp',
  './assets/img/hero_1.webp',
  './assets/img/hero_2.webp',
  './assets/img/hero_3.webp'
];

/* 2.  INSTALL ─ precache del app-shell -------------------------------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* 3.  ACTIVATE ─ limpia versiones viejas ------------------------------ */
self.addEventListener('activate', event => {
  const keep = [STATIC_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (!keep.includes(k) && caches.delete(k))))
    )
  );
  self.clients.claim();
});

/* 4.  FETCH ─ estrategia según tipo de recurso ------------------------ */
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;          // ignoramos POST, etc.

  const url = new URL(request.url);

  /* 4-A  Navegación → Network First con fallback offline.html */
  if (request.mode === 'navigate') {
    return event.respondWith(
      fetch(request)
        .then(res => {
          /* actualizo caché en segundo plano */
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then(res => res || caches.match('./offline.html'))
        )
    );
  }

  /* 4-B  Imágenes → Cache First (ideal para “img”, “image/webp”, etc.) */
  if (
    request.destination === 'image' ||
    /\.(?:png|jpe?g|webp|svg|gif)$/i.test(url.pathname)
  ) {
    return event.respondWith(
      caches.match(request).then(
        cached => cached || fetch(request).then(res => {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(request, clone));
          return res;
        })
      )
    );
  }

  /* 4-C  Fonts, CSS, JS → Stale-While-Revalidate --------------------- */
  if (
    ['style', 'script', 'font'].includes(request.destination) ||
    /\.(?:woff2?|ttf|css|js)$/i.test(url.pathname)
  ) {
    return event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(res => {
          caches.open(RUNTIME_CACHE).then(c => c.put(request, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }

  /* 4-D  Otros recursos → default Network First ---------------------- */
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
/* ───────────────────────────────────────────────────────────────────── */