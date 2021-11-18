const { all, create, search, update } = require('./jobs');
const { handleError, handleResponse } = require('../helpers');

exports.all = (req, res) => {
  all({ id: req.params.id }).then(handleResponse(res)).catch(handleError(res));
};

exports.create = (req, res) => {
  create(req.body).then(handleResponse(res)).catch(handleError(res));
};

exports.update = (req, res) => {
  update(req.params.id, req.body)
    .then(handleResponse(res))
    .catch(handleError(res));
};

exports.search = (req, res) => {
  search(req.query).then(handleResponse(res, 200)).catch(handleError(res));
};