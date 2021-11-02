const { DateTime } = require('luxon');
const SQL = require('sql-template-strings');
const {
  queryRows,
  queryOne,
  validation,
  ErrorException,
} = require('../../helpers');
const { format } = require('../util');
const { missingValidation, isDefined } = validation;

const search = async ({ user_id, restaurant_id, time, startTime, endTime }) => {
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
      "_id",
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

  const restaurants = await queryOne(query);
  if (!restaurants) {
    throw new ErrorException('Restaurant not found', 204);
  }

  // if there is a defined time, go with it unless
  // go with user's
  time = time || userTime.budget_time;
  if (time === 'custom') {
  }

  const queryVisits = SQL`
    SELECT
      "_id",
      "spent",
      "visited_at"
    FROM
      "Visits"
    WHERE 
      "restaurant_id"=${restaurant_id} AND
      "user_id"=${user_id}
  `;
  queryVisits.append(getTime({ time }));
  queryVisits.append(SQL`ORDER BY "visited_at" DESC`);
  let visits = await queryRows(queryVisits);
  visits = visits.map((item) => format.visit.time(item));
  restaurants.Visits = visits;

  return {
    data: restaurants,
  };
};

const getTime = ({ time, startTime, endTime }) => {
  switch (time) {
    case 'daily':
      return SQL` AND "visited_at" >= ${DateTime.now()
        .minus({ days: 1 })
        .toISODate()} AND
        "visited_at" <= ${DateTime.now().toISODate()}  
      `;
    case 'weekly':
      return SQL` AND "visited_at" >= ${DateTime.now()
        .minus({ weeks: 1 })
        .toISODate()} AND
        "visited_at" <= ${DateTime.now().toISODate()}  
      `;
    case 'monthly':
      return SQL` AND "visited_at" >= ${DateTime.now()
        .minus({ months: 1 })
        .toISODate()} AND
        "visited_at" <= ${DateTime.now().toISODate()}  
      `;
    case 'custom':
      return SQL` AND "visited_at" >= ${startTime} AND 
      "visited_at" <= ${endTime}`;
    default:
      throw new ErrorException('Invalid Time', 400);
  }
};

module.exports = search;
