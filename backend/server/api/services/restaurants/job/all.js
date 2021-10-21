const SQL = require('sql-template-strings');
const { queryRows } = require('../../helpers');

const all = async () => {
  const query = SQL`SELECT *, "r"."name", "r"."image_url" FROM "Restaurants" "r"`;
  const data = await queryRows(query);
  return {
    total: data.length,
    data,
  };
};

module.exports = all;
