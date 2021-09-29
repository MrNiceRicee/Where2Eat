const services = require('./services');
/**
 * routes for api
 * @param {Function} router - express server
 * @param {String} prefix - prefix url for app
 */
const routes = (router, prefix) => {

  // users controller
  services.users.router(router, `${prefix}/users`);

  // restaurant controller
  services.restaurants.router(router, `${prefix}/restaurants`);

  // visits controller
  services.visits.router(router, `${prefix}/visits`);

};

module.exports = routes;