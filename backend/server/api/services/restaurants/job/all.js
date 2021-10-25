const SQL = require('sql-template-strings');
const { queryRows } = require('../../helpers');

const all = async () => {
  const query = SQL`SELECT "name", "image_url", "location", "category", "price", "rating", "review_count" FROM "Restaurants" "r"`;
  const data = await queryRows(query);
  return {
    total: data.length,
    data,
  };
};

module.exports = all;
