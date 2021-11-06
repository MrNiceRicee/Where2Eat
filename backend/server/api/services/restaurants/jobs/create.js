const SQL = require('sql-template-strings');
const { queryOne, ErrorException } = require('../../helpers');

const create = async ({ name } = {}) => {
  if (!name) throw new ErrorException('Missing name', 500);
  const query = SQL`
    INSERT INTO "Restaurant" ("name")
      VALUES(${name})
    RETURNING *
    `;
  const res = await queryOne(query);
  return res;
};

module.exports = create;
