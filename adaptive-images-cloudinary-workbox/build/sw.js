importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log('Workbox is loaded');
  workbox.precaching.precacheAndRoute([
  {
    "url": "app.css",
    "revision": "d711ac8e251dc4f37637779440dfd7c8"
  },
  {
    "url": "bootstrap.css",
    "revision": "d26ecc887c12f855a908679dae6704e3"
  },
  {
    "url": "bootstrap.css.map",
    "revision": "0ab7c5a3c60c431b89b5a1e3fb26c525"
  },
  {
    "url": "index.html",
    "revision": "6a84c50bebfffcf8a46f18fcdd8ecaf8"
  },
  {
    "url": "app.js",
    "revision": "18677e357d02201bb1d3da4e1ad15992"
  }
]);
  workbox.routing.registerRoute('/api/news',
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'api-cache'
    })
  );

  const cloudinaryPlugin = {
    requestWillFetch: async ({ request }) => {
      if (/\.jpg$|.png$|.gif$|.webp$/.test(request.url)) {
        let url = request.url.split('/');
        let newPart;
        let format = 'f_auto';
        switch ((navigator && navigator.connection) ? navigator.connection.effectiveType : '') {
          case '4g':
            newPart = 'q_auto:good';
          break;
    
          case '3g':
            newPart = 'q_auto:eco';
          break;
    
          case'2g':
          case 'slow-2g':
            newPart = 'q_auto:low';
          break;
    
          default:
            newPart = 'q_auto:good';
          break;
        }
    
        url.splice(url.length - 2, 0, `${newPart},${format}`);
        const finalUrl = url.join('/');

        const newUrl = new URL(finalUrl);
        return new Request(newUrl.href, { headers: request.headers });
      }
    },
  };

  workbox.routing.registerRoute(
    new RegExp('^https://res\.cloudinary\.com'),
    
    workbox.strategies.cacheFirst({
      cacheName: 'cloudinary-images',
      plugins: [
        cloudinaryPlugin,
        new workbox.expiration.Plugin({
          maxEntries: 50,
          purgeOnQuotaError: true,
        }),
      ],
    })
  );
} else {
  console.log('Could not load Workbox');
}
