const SQL = require('sql-template-strings');
const { query, ErrorException } = require('../helpers');

const create = async (id) => {
  if (!id) throw new ErrorException('Missing ID', 500);
  const statement = SQL`
    DELETE FROM "Users"
      WHERE "_id"=${id}
    `;
  await query(statement);
  return {
    message: `Deleted User`,
  };
};

module.exports = create;
