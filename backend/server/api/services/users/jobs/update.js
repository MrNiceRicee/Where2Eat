const SQL = require('sql-template-strings');
const { queryOne, ErrorException, validation } = require('../../helpers');
const { missingValidation } = validation;
const editable = { name: true, budget: true, budget_time: true };

const update = async (id, update ) => {
  missingValidation(id, 'ID', 400);
  missingValidation(update, 'update package', 400);

  const checkDB = await queryOne(
    SQL`SELECT "_id", "name" FROM "Users" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No User found', 204);

  const query = SQL`
      UPDATE "Users"
        SET `;
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
    message: 'Updated User',
  };
};

module.exports = update;
