const webPush = require('web-push');
const keys = webPush.generateVAPIDKeys();
let savedSubscription = null;

// in practice, the host should be HTTPS
webPush.setVapidDetails(
  'http://localhost/',
  keys.publicKey,
  keys.privateKey
);

function vapidPublicKey(req, res) {
  res.json(keys.publicKey);
}

function saveSubscription(req, res) {
  const subscription = req.body.subscription;
  savedSubscription = JSON.stringify(subscription);
  return res.json();
}

function getSubscription() {
  return savedSubscription;
}

module.exports = {
  vapidPublicKey,
  saveSubscription,
  getSubscription
};
