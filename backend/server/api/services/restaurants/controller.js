const all = require('./all');
const { handleError, handleResponse } = require('../helpers');

exports.all = (req, res) => {
  all().then(handleResponse(res)).catch(handleError(res));
};
