const all = require('./all');
const create = require('./create');
const { handleError, handleResponse } = require('../helpers');

exports.all = (req, res) => {
  all().then(handleResponse(res)).catch(handleError(res));
};

exports.create = (req, res) => {
  create(req.body).then(handleResponse(res, 201)).catch(handleError(res));
};
