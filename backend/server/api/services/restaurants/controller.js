const { handleError, handleResponse } = require('../helpers');
const { all, create, search, update } = require('./jobs');

exports.all = (req, res) => {
  all(req.params).then(handleResponse(res)).catch(handleError(res));
};

exports.create = (req, res) => {
  create(req.body).then(handleResponse(res)).catch(handleError(res));
};

exports.search = (req, res) => {
  search(req.query).then(handleResponse(res)).catch(handleError(res));
};

exports.update = (req, res) => {
  update(req.params.id, req.body)
    .then(handleResponse(res))
    .catch(handleError(res));
};
