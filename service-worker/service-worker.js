const files = [
  '/',
  '/index.html',
  '/app.js',
  // '/app.css'
];

const cacheName = 'my-cache';
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(files))
  );
});

self.addEventListener('fetch', event => {
  console.log('[SW] Fetching:', event.request);
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(error => console.error('[SW] Error during network fetch', error))
  );
});


// const cacheName = 'my-cache';
// const baseUrl = 'http://localhost:8080';

// const files = [
//   '/',
//   '/index.html',
//   '/app.js',
//   '/app.css'
// ];

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(cacheName).then(cache => cache.addAll(files))
//   );
// });

// self.addEventListener('activate', event => {
//   console.log('[SW] Activate');
//   event.waitUntil(
//     caches.keys().then(keyList => {
//       return Promise.all(keyList.map(key => {
//         if (key !== cacheName)  {
//           console.log('[SW] Removing old cache', key);
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
//   return self.clients.claim();
// });


