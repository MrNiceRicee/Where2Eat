const { all } = require('./jobs');
const { handleError, handleResponse } = require('../helpers');

exports.all = (req, res) => {
  all(req.params).then(handleResponse(res)).catch(handleError(res));
};
