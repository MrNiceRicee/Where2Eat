const Big = require('big.js');
const ErrorException = require('./error');

const getOperator = (operator) => {
  switch (operator) {
    case 'gte':
      return ['gte', '>='];
    case 'gt':
      return ['gt', '>'];
    case 'lte':
      return ['lte', '<='];
    case 'lt':
      return ['lt', '<'];
    case 'eq':
      return ['eq', '='];
    default:
      throw new ErrorException('Invalid Operator', 400);
  }
};

/**
 * Compare two numbers and standardize how the errors are created
 * @param {Object}  Object - structure below
 * @operator String. how to compare
 * @itemName String. name for the errors
 * @validateNumber Number. number to validate
 * @validateArrayLength Array. validate array and the compare the length
 * @compareNumber Number. what to compare against
 * @failedMessage String. error when the comparison failed
 * @invalidMessage String. error when the params are missing
 * @returns Boolean true for passing, else throw SLException
 */
const numberValidation = ({
  operator,
  itemName,
  validateNumber,
  compareNumber,
  failedMessage,
  invalidMessage,
}) => {
  const [op, sign] = getOperator(operator);
  try {
    if (!Big(validateNumber)[op](compareNumber)) {
      throw new Error('catch below');
    }
    return true;
  } catch (error) {
    if (isDefined(validateNumber)) {
      throw new ErrorException(
        failedMessage || `${itemName} must be ${sign} ${compareNumber}`,
        400
      );
    }
    throw new ErrorException(invalidMessage || `Missing ${itemName}`, 400);
  }
};

/**
 * Checks to see if validate is not null or undefined
 * @param {any} validate 
 * @returns Boolean
 */
const isDefined = (validate) => {
  if (
    validate === null ||
    validate === 'null' ||
    validate === undefined ||
    validate === 'undefined'
  ) {
    return false;
  }
  return true;
};

/**
 * Check if the item exist and truthy
 * @param {any} item 
 * @param {String} itemName 
 * @param {Number} statusCode - 400.
 */
const missingValidation = (item, itemName, statusCode = 400, message) => {
  if (!isDefined(item) || !item) {
    throw new ErrorException(message || `Missing ${itemName}`, statusCode);
  }
};

module.exports = {
  isDefined,
  missingValidation,
  numberValidation,
};
