const SQL = require('sql-template-strings');
const { queryOne, ErrorException, validation } = require('../../helpers');
const { missingValidation } = validation;
const editable = { name: true, budget: true, budget_time: true };

const update = async (id, { update } = {}) => {
  missingValidation(id, 'ID', 400);
  missingValidation(update, 'update package', 400);

  const checkDB = await queryOne(
    SQL`SELECT "_id", "name" FROM "Users" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No User found', 204);

  const query = SQL`
      UPDATE "Users"
        SET `;
  let filter = SQL` WHERE "_id"=${id} `;

  const updateKeys = Object.keys(update);
  const acceptedKeys = updateKeys.map((item) => {
    if (!editable[item]) {
      throw new ErrorException('Invalid Update', 400);
    }
    return (` "${item}"='${update[item]}' `);
  });
  query.append(acceptedKeys.join(' , '));
  query.append(filter);
  await queryOne(query);
  return {
    message: 'Updated User',
  };
};

module.exports = update;
