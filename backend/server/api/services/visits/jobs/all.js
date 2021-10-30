const SQL = require('sql-template-strings');
const { queryRows, ErrorException } = require('../../helpers');

const all = async ({ id }) => {
  if (!id) throw new ErrorException('Missing User ID', 400);
  let query = SQL`
  SELECT
    "Visit"."spent",
    "Visit"."visited_at",
    "User"."name" as "User_name",
    "Restaurant"."name" as "Restaurant_name",
    "Restaurant"."image_url" as "Restaurant_image_url",
    "Restaurant"."price" as "Restaurant_price",
    "Restaurant"."rating" as "Restaurant_rating",
    "Restaurant"."review_count" as "Restaurant_review_count",
    "Restaurant"."url" as "Restaurant_url"

  FROM "Visits" "Visit"
  LEFT JOIN "Users" "User"
    ON "User"."_id"="Visit"."user_id"
  LEFT JOIN "Restaurants" "Restaurant"
    ON "Restaurant"."_id"="Visit"."restaurant_id"
  WHERE "User"._id=${id}
  ORDER BY
    "Visit".visited_at DESC
  `;

  const data = await queryRows(query);
  return {
    total: data.length,
    data,
  };
};

module.exports = all;

/*




*/
