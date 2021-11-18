const SQL = require('sql-template-strings');
const { queryRows, queryOne, validation } = require('../../helpers');
const { missingValidation } = validation;
const { format } = require('../util');

const all = async ({ id }) => {
  missingValidation(id, 'User ID', 400);

  // check user
  const user = await queryOne(
    SQL` SELECT "_id" FROM "Users" WHERE "_id"=${id} `
  );

  missingValidation(user, '', 400, 'User not found');

  let query = SQL`
  SELECT
    "Visit"."visited_at" as "Visit_visited_at",
    "Visit"."spent" "Visit_spent",
    "Visit"."_id" as "Visit_id",
    "Restaurant"."_id" as "Restaurant_id",
    "Restaurant"."name" as "Restaurant_name",
    "Restaurant"."image_url" as "Restaurant_image_url",
    "Restaurant"."price" as "Restaurant_price",
    "Restaurant"."rating" as "Restaurant_rating",
    "Restaurant"."review_count" as "Restaurant_review_count",
    "Restaurant"."url" as "Restaurant_url"

  FROM "Visits" "Visit"
  LEFT JOIN "Restaurants" "Restaurant"
    ON "Restaurant"."_id"="Visit"."restaurant_id"
  WHERE "Visit"."user_id"=${id}
  ORDER BY
    "Visit".visited_at DESC
  `;

  const data = await queryRows(query);
  return {
    total: data.length,
    data: data.map((item) => {
      return {
        Visit_human_time: format.visit.humanTime(item.Visit_visited_at),
        ...item,
      };
    }),
  };
};

module.exports = all;

/*




*/
