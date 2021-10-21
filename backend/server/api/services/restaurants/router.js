const controller = require('./controller');

const routes = (router, prefix) => {
  // get all
  router.get(`${prefix}/`, controller.all);

  // create
  router.post(`${prefix}/`, controller.create);

  // yelp api
  router.get(`${prefix}/search`, controller.search);
};

module.exports = routes;
