// order = [ '', 'DESC' ];
const SQL = require('sql-template-strings');
const { ErrorException } = require('.');
const { isDefined } = require('./validation');

const orderFormat = (order) => {
  try {
    if (!isDefined(order) && !order) {
      return SQL``;
    }
    const [column, orderType] = JSON.parse(order);
    return ` ORDER BY ${column} ${orderType}`;
  } catch (err) {
    throw new ErrorException('Invalid Order Format', 400);
  }
};

module.exports = {
  orderFormat,
};
