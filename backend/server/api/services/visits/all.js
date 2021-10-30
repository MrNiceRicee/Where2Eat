const SQL = require('sql-template-strings');
const { queryRows } = require('../helpers');

const all = async () => {
  const query = SQL`
  SELECT "Visits".user_id,
    "Visits".restaurant_id,
    "Visits".name,
    "Restaurants".image_url "Restaurants.image_url",
    "Restaurants".location "Restaurants.location",
    "Restaurants".category "Restaurants.category",
    "Restaurants".price "Restaurants.price",
    "Restaurants".rating "Restaurants.rating",
    "Restaurants".review_count "Restaurants.review_count"

  FROM "Visits" "Visits"
    LEFT OUTER JOIN "Restaurants" "Restaurants" ON "Restaurants"._id = "Visits".restaurant_id
  ORDER BY
    "Visits".visited_at DESC
  `;

  const data = await queryRows(query);
  return {
    total: data.length,
    data,
  };
};

module.exports = all;
