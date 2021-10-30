const SQL = require('sql-template-strings');
const { queryOne } = require('../../helpers');

const create = async ({ user_id, restaurant_id, spent }) => {
  const query = SQL`
    INSERT INTO "Visits" ("user_id", "restaurant_id", "spent")
      VALUES(${user_id}, ${restaurant_id}, ${spent})
    `;
  const data = await queryOne(query);
  return data;
};

module.exports = create;
