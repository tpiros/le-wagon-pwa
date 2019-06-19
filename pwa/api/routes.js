const news = require('./news');
const webPush = require('web-push');
const pushRoutes = require('./push-routes');

function getNews(req, res) {
  const sortedNews = news.sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return res.json(sortedNews);
}

function addNews(req, res) {
  const freshNews = req.body;
  news.push(freshNews);
  const subscription = JSON.parse(pushRoutes.getSubscription());
  if (subscription) {
    webPush.sendNotification(subscription, JSON.stringify(freshNews))
      .then(() => res.json(news))
      .catch(error => console.error('Push notification error', error));
  } else {
    return res.json(news);
  }
}

module.exports = {
  getNews,
  addNews
};
