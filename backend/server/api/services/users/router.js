const controller = require('./controller');
const { auth } = require('../helpers');

const routes = (router, prefix) => {
  // get all
  router.get(`${prefix}/all`, controller.all);

  // create user
  router.post(`${prefix}/create`, auth, controller.create);
};

module.exports = routes;
