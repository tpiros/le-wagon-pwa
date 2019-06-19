// In production, the app should be served over HTTPS
const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const pushRoutes = require('./api/push-routes');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Change this, if required
const port = 8099;

app.get('/api/news', routes.getNews);
app.post('/api/news', routes.addNews);

app.get('/api/getPublicKey', pushRoutes.vapidPublicKey);
app.post('/api/saveSubscription', pushRoutes.saveSubscription);

app.all('*', (request, response) => {
  if (request.url === '/favicon.ico' || request.url === '/robots.txt') {
    return;
  } else {
    return response.sendFile(path.join(`${__dirname}/${request.url}`));
  }
});

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`App listening on http://${host}:${port}`);
});