const CACHE_VERSION = 'v5'; // ← МЕНЯЙ ЭТУ ВЕРСИЮ ПРИ КАЖДОМ ОБНОВЛЕНИИ
const CACHE_NAME = `vet-landing-${CACHE_VERSION}`;
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icon23-192.png',
  '/icon23-512.png'
];

// Установка
self.addEventListener('install', event => {
  self.skipWaiting(); // ← Активируем новый SW сразу
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Активация - удаляем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Забираем контроль над всеми вкладками сразу
      clients.claim(),
      // Удаляем старые версии кэша
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Обработка запросов - сеть первая, потом кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Если запрос успешен, обновляем кэш
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, берем из кэша
        return caches.match(event.request);
      })
  );
});