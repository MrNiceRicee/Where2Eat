const { handleError, handleResponse } = require('../helpers');
const all = require('./all');
const create = require('./create');
const update = require('./update');
const deleteItem = require('./deleteItem');

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
