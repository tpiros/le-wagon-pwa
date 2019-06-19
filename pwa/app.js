// PWAs require HTTPS - this forces HTTPS connections
// only uncomment if you have HTTPS setup for localhost
// if (location.protocol !== 'https:' && (!location.port || location.port === 80)) {
//   location.protocol = 'https:';
// }

// Note, in production this should be HTTPS
const baseUrl = 'http://localhost:8099';
const newsCard = document.querySelector('.template');

let dataFromNetwork = false;
let serviceWorkerRegistration = null;

function generateNewsCard(newsItem) {
  const main = document.getElementById('main');
  const card = newsCard.cloneNode(true);
  card.querySelector('.card-title').innerHTML = `<strong>${newsItem.title}</strong> by ${newsItem.author} on ${newsItem.publishedAt}`;
  card.querySelector('.card-content-text').textContent = newsItem.description;
  card.querySelector('.read-more').setAttribute('href', newsItem.url);
  main.appendChild(card);
}

function makeNetworkRequest() {
  return fetch(`${baseUrl}/api/news`)
  .then(response => response.json())
  .then(news => {
    news.forEach(newsItem => generateNewsCard(newsItem));
    newsCard.style.display = 'none';
  })
  .catch(error => console.error(error));
}

function start() {
  makeNetworkRequest();
  if ('caches' in window) {
    caches.match(`${baseUrl}/api/news`).then(response => {
      if (!response) {
        throw Error('No cached data!')
      }
      return response.json();
    })
    .then(news => {
      if (!dataFromNetwork) {
        news.forEach(newsItem => generateNewsCard(newsItem))
        newsCard.style.display = 'none';
      }
    })
    .catch(() => makeNetworkRequest())
    .catch(error => console.error(error));
  }
}

async function createSubscription() {
  const publicKeyRequest = await fetch(`${baseUrl}/api/getPublicKey`);
  const publicKey = await publicKeyRequest.json();
  const finalKey = urlBase64ToUint8Array(publicKey);
  return serviceWorkerRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: finalKey
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(() => console.log('Registered Service Worker'))
    .catch(error => console.log(error));

  navigator.serviceWorker.ready
    .then(async registration => {
      serviceWorkerRegistration = registration;
      const subscription = await createSubscription();
      const response = await fetch(`${baseUrl}/api/saveSubscription`, {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          subscription
        })
      });
    })
    .catch(error => console.log(error));
}

// initialise the application
start();

// Helper function to convert base64 string to Uint8 Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

