const CACHE_NAME = 'espelico-trip-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/content.json',
  '/print.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/vinhomes.jpg',
  '/images/garden-residency.jpg',
  '/images/urban-village.jpg',
  '/docs/coe-jim.png',
  '/docs/payroll-jim.pdf',
  '/docs/bank-statement.pdf',
  '/docs/proof-of-funds-1.png',
  '/docs/proof-of-funds-2.png',
  '/docs/business-permit-deane.jpg',
  '/docs/store-photo.jpg',
  '/docs/flight-klwnkq.pdf',
  '/docs/flight-hkgupt.pdf',
  '/docs/vinhomes-airbnb.pdf',
  '/docs/travel-tax.pdf',
  '/docs/etravel-jim.png',
  '/docs/etravel-mom.png',
  '/docs/etravel-deane.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS.filter(asset => {
        return true;
      })).catch(err => {
        console.log('Some assets failed to cache, continuing...', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        return new Response('Offline - content not cached', { status: 503 });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'CACHE_ALL') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(
          ASSETS.map(url => {
            return fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {});
          })
        );
      }).then(() => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage('CACHE_COMPLETE'));
        });
      })
    );
  }
});
