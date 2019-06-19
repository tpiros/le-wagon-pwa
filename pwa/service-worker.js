const cacheName = 'pwa-news-cache';
const dataCacheName = 'pwa-news-data-cache';

// This should go out to a URL using HTTPS
const baseUrl = 'http://localhost';

const files = [
  '/',
  '/index.html',
  '/app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(files))
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName && key !== dataCacheName)  {
          console.log('[SW] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
  console.log('[SW] Fetching:', event.request);
  const api = `${baseUrl}/api/news`;
  if (event.request.url.indexOf(api) > -1) {
    event.respondWith(
      caches.open(dataCacheName)
        .then(cache => {
          return fetch(event.request)
            .then(response => {
              cache.put(event.request.url, response.clone());
              return response;
            })
            .catch(error => console.error('[SW] Error with cache fetch', error));
        }).catch(error => console.error('[SW] Error opening cache', error))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(error => console.error('[SW] Error during network fetch', error))
    );
  }
});

self.addEventListener('push', event => {
  console.log('[SW] Push received');
  console.log('[SW] Push data', event);
  const payload = JSON.parse(event.data.text());
  event.waitUntil(
    self.registration.showNotification('PWA News', {
      body: `${payload.title} (by ${payload.author})`
    })
  );
});