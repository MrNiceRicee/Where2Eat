const { handleError, handleResponse } = require('../helpers');
const all = require('./all');
const create = require('./create');
const update = require('./update');
const deleteItem = require('./deleteItem');
const search = require('./search');

exports.all = (req, res) => {
  all().then(handleResponse(res)).catch(handleError(res));
};

exports.create = (req, res) => {
  create(req.body).then(handleResponse(res, 201)).catch(handleError(res));
};

exports.update = (req, res) => {
  update(req.params.id, req.body)
    .then(handleResponse(res, 201))
    .catch(handleError(res));
};

exports.deleteItem = (req, res) => {
  deleteItem(req.params.id).then(handleResponse(res)).catch(handleError(res));
};

exports.search = (req, res) => {
  search({ id: req.params.id, ...req.query })
    .then(handleResponse(res, 200))
    .catch(handleError(res));
};
