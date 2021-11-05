const Big = require('big.js');
const ErrorException = require('./error');
const { DateTime } = require('luxon');

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
  name,
  validate,
  compare,
  failedMessage,
  invalidMessage
}) => {
  const [op, sign] = getOperator(operator);
  try {
    if (!Big(validate)[op](compare)) {
      throw new Error('catch below');
    }
    return true;
  } catch (error) {
    if (isDefined(validate)) {
      throw new ErrorException(
        failedMessage || `${name} must be ${sign} ${compare}`,
        400
      );
    }
    throw new ErrorException(invalidMessage || `Missing ${name}`, 400);
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

/**
 * Verify that the date exist, and also if it is a valid date
 * @param {String} date - date to validate
 * @param {String} name - name of date
 * @returns Boolean
 */
const isValidDate = (date, name) => {
  try {
    if (!DateTime.fromISO(date).isValid) {
      throw new Error('throw below');
    }
    return true;
  } catch (err) {
    // console.log(err);
    throw new ErrorException(`Invalid ${name} Date`, 400);
  }
};

/**
 * Verify object exist, and is part of an array (verified selections)
 * @param {Object} param
 * @validate - String - Number. compare if it is valid
 * @name - String. Name of the object
 * @valid - Array. Valid selections
 * @strict - Boolean. Checks if it is a truthy value. Defualt: true
 * @returns Boolean
 */
const isIncluded = ({ validate, name, valid, strict = true }) => {
  if (!isDefined(validate)) {
    throw new ErrorException(`Missing ${name}`, 400);
  }
  if (strict && !validate) {
    throw new ErrorException(`Missing ${name}`, 400);
  }
  if (!valid.includes(validate)) {
    throw new ErrorException(
      name ? `Invalid entry - ${name}` : `Invalid entry`,
      400
    );
  }
  return true;
};

module.exports = {
  isDefined,
  isValidDate,
  isIncluded,
  missingValidation,
  numberValidation,
};
