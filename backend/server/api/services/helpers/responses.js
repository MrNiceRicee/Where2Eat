/**
 * handles errors from the server
 * @param {func} res - res from express
 * @param {Number} statusCode - custom response code
 */
const handleError = (res, statusCode = 500) => {
  return (err) => {
    if (err.statusCode) {
      statusCode = err.statusCode;
    }
    console.error(err);
    return res.status(statusCode).send(err.message || err);
  };
};

/**
 * handles sucess cases from the server
 * @param {func} res - res from express
 * @param {Number} statusCode - custom response code
 * @returns
 */
const handleResponse = (res, statusCode = 200) => {
  return (message = '') => {
    return res.status(statusCode).send(message);
  };
};


module.exports = {
  handleError,
  handleResponse,
};
