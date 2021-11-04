const SQL = require('sql-template-strings');
const { queryOne, ErrorException } = require('../../helpers');

const create = async ({ name } = {}) => {
  if (!name) throw new ErrorException('Missing Name', 400);
  const query = SQL`
    INSERT INTO "Users" ("name")
      VALUES(${name})
    RETURNING "name", "total_visits", "total_visited_restaurants", "spent", "budget", "budget_time";
    `;
  const res = await queryOne(query);
  return { data: res};
};

module.exports = create;
