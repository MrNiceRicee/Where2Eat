const SQL = require('sql-template-strings');
const {
  query,
  queryOne,
  validation,
} = require('../../helpers');
const { missingValidation } = validation;

const create = async (id) => {
  missingValidation(id, 'ID', 400);

  const checkDB = await queryOne(
    SQL`SELECT "_id", "name" FROM "Users" WHERE "_id"=${id}`
  );
  missingValidation(checkDB, 'User', 400, 'No User found');

  const statement = SQL`
    DELETE FROM "Users"
      WHERE "_id"=${id}
    `;
  await query(statement);
  return {
    data: 'Deleted User',
  };
};
module.exports = create;
