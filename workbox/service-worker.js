importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "app.css",
    "revision": "b40b42e08d5faf9fcdf6b4a9bc275a33"
  },
  {
    "url": "app.js",
    "revision": "95ea9799fe960faa98fbc709a831b960"
  },
  {
    "url": "build.js",
    "revision": "58d5bf51f4e9728640359aa277d23895"
  },
  {
    "url": "index.html",
    "revision": "f6475efea4e7becddf75a6ac3f281380"
  },
  {
    "url": "service-worker.dev.js",
    "revision": "85258ffc9a012a3f5fc48e6f1fff4f09"
  }
]);

  
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

