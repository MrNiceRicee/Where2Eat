const SQL = require('sql-template-strings');
const { queryOne, ErrorException } = require('../../helpers');
const editable = { name: true, budget: true, budget_time: true };

const update = async (id, { update } = {}) => {
  if (!id) throw new ErrorException('Missing ID', 500);
  if (!update) throw new ErrorException('Missing update package', 400);

  const checkDB = await queryOne(
    SQL`SELECT "_id", "name" FROM "Users" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No User found', 500);

  const query = SQL`
      UPDATE "Users"
        SET `;
  let filter = SQL` WHERE "_id"=${id} `;

  const updateKeys = Object.keys(update);
  const acceptedKeys = [];
  updateKeys.forEach((item) => {
    if (editable[item]) {
      acceptedKeys.push(` "${item}"='${update[item]}' `);
    }
  });

  query.append(acceptedKeys.join(' , '));
  query.append(filter);
  await queryOne(query);
  return {
    message: 'Updated User',
  };
};

module.exports = update;
