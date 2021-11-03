const controller = require('./controller');

const routes = (router, prefix) => {
  // get all
  router.get(`${prefix}/:id`, controller.all);

  // 
};

module.exports = routes;
