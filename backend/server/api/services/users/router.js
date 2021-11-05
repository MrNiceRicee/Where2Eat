const controller = require('./controller');
const { auth } = require('../helpers');

const routes = (router, prefix) => {
  // get all
  router.get(`${prefix}`, controller.all);

  // get some users
  router.get(`${prefix}/search`, controller.search)
  router.get(`${prefix}/:name`, controller.find)

  // create user
  router.post(`${prefix}/`, auth, controller.create);

  // update user
  router.put(`${prefix}/:id`, controller.update)

  // delete user
  router.delete(`${prefix}/:id`, controller.deleteItem)
};

module.exports = routes;
