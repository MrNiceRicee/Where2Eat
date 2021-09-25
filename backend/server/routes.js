/**
 *  top level routing
 * @param {Function} app - express app
 */
const routes = (app) => {
  // check if server is live
  app.get('/status', (req, res) => {
    res.status(200).send('Live!');
  });

  // main api
  require('./api')(app, '/api');

  // everything else
  app.all('*', (req, res) => {
    res.status(400).send('Bad Request');
  });
};

module.exports = routes;
