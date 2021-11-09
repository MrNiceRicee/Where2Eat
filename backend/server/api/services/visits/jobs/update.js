const Big = require('big.js');
const { DateTime } = require('luxon');
const SQL = require('sql-template-strings');
const { queryOne, ErrorException, validation } = require('../../helpers');
const { missingValidation, isDefined, isValidDate } = validation;
const editable = {
  spent: true,
  visited_at: true,
};

const update = async (id, update) => {
  missingValidation(id, 'ID', 400);
  missingValidation(update, 'Update Package', 400);

  const checkDB = await queryOne(
    SQL`SELECT "_id" FROM "Visits" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No Visit found', 204);

  let query = SQL`
  UPDATE "Visits"
    SET `;

  // cannot spend less than or eq to 0
  if (isDefined(update.spent)) {
    try {
      if (Big(update.spent).lte(0)) {
        throw new ErrorException('Spent must be > 0', 400);
      }
    } catch (err) {
      if (err instanceof ErrorException) {
        throw err;
      }
      throw new ErrorException('Invalid Spent', 400);
    }
  }

  if (isDefined(update.visited_at)) {
    try {
      isValidDate(update.visited_at, 'Visit');
      if (DateTime.fromISO(update.visited_at).toISODate() > DateTime.now().toISODate()) {
        throw new ErrorException('Date cannot be set in the future', 400);
      }
    } catch (err) {
      throw err;
    }
  }

  const updateKeys = Object.keys(update);
  const validated = [];
  updateKeys.forEach((item) => {
    if (!editable[item]) {
      throw new ErrorException('Invalid Update', 400);
    }
    if (!update[item]) {
      throw new ErrorException('Missing Update Details', 400);
    }
    validated.push(item);
  });
  validated.forEach((item, index) => {
    query.append(` ${item}=`);
    query.append(SQL`${update[item]}`);
    if (index < validated.length - 1) {
      query.append(',');
    }
  });
  const filter = SQL` WHERE "_id"=${id} `;
  query.append(filter);
  await queryOne(query);
  return {
    message: 'Updated Visit',
  };
};

module.exports = update;
