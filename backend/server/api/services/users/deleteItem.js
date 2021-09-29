const SQL = require('sql-template-strings');
const { query, queryOne, ErrorException } = require('../helpers');

const create = async (id) => {
  if (!id) throw new ErrorException('Missing ID', 500);
  const checkDB = await queryOne(
    SQL`SELECT "_id", "name" FROM "Users" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No User found', 500);

  const statement = SQL`
    DELETE FROM "Users"
      WHERE "_id"=${id}
    `;
  await query(statement);
  return {
    message: 'Deleted User',
  };
};

module.exports = create;
