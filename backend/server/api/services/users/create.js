const SQL = require('sql-template-strings');
const { queryOne, ErrorException } = require('../helpers');

const create = async ({ name } = {}) => {
  if (!name) throw new ErrorException('Missing name', 500);
  const query = SQL`
    INSERT INTO "Users" ("name")
      VALUES(${name})
    `;
  await queryOne(query);
  return {
    message: `Created User: ${name}`,
  };
};

module.exports = create;
