const controller = require('./controller');

const routes = (router, prefix) => {
  // search visits
  router.get(`${prefix}/search`, controller.search);
  // get all visits from user id
  router.get(`${prefix}/:id`, controller.all);

  // create  visit
  router.post(`${prefix}/`, controller.create);

  // update visit
  router.put(`${prefix}/:id`, controller.update);
};

module.exports = routes;
