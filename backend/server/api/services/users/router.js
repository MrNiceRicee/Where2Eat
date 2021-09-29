const controller = require('./controller');
const { auth } = require('../helpers');

const routes = (router, prefix) => {
  // get all
  router.get(`${prefix}/all`, controller.all);

  // create user
  router.post(`${prefix}`, auth, controller.create);

  // update user
  router.put(`${prefix}/:id`, controller.update)
};

module.exports = routes;
