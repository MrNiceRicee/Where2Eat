const { DateTime } = require('luxon');
const SQL = require('sql-template-strings');
const {
  queryRows,
  queryOne,
  validation,
  ErrorException,
} = require('../../helpers');
const { missingValidation, isDefined } = validation;

const search = async ({ user_id, restaurant_id, time }) => {
  missingValidation(user_id, 'User ID', 400);
  missingValidation(restaurant_id, 'Restaurant ID', 400);

  const userTime = await queryOne(
    SQL`SELECT "budget_time" FROM "Users" WHERE "_id"=${user_id}`
  );

  if (!isDefined(userTime)) {
    throw new ErrorException('User not found', 204);
  }

  let query = SQL`
    SELECT
      "name",
      "image_url",
      "location",
      "category",
      "price",
      "rating",
      "review_count",
      "url"
    FROM
      "Restaurants"
    WHERE
      "_id"=${restaurant_id}
  `;

  const restaurants = await queryRows(query);
  if (!restaurants.length) {
    throw new ErrorException('Restaurant not found', 204);
  }

  time = time || userTime;

  const queryVisits = SQL`
    SELECT
      "spent",
      "visited_at"
    FROM
      "Visits"
    WHERE "restaurant_id"=${restaurant_id}
  `;
  let visits = await queryRows(queryVisits);
  visits = visits.map((item) => {
    const newTime = DateTime.fromJSDate(item.visited_at).toFormat('yyyy MMMM dd');
    item.human_time = DateTime.fromJSDate(item.visited_at).toRelative();
    item.visited_at = newTime;
    return item;
  });
  restaurants.Visits = visits;

  return {
    data: restaurants,
  };
};

const getTime = (time) => {};

module.exports = search;
