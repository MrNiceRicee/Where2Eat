const { DateTime } = require('luxon');
const SQL = require('sql-template-strings');
const {
  queryRows,
  queryOne,
  validation,
  ErrorException,
} = require('../../helpers');
const { format } = require('../util');
const { missingValidation, isValidDate } = validation;

const search = async ({ user_id, restaurant_id, time, startTime, endTime }) => {
  missingValidation(user_id, 'User ID', 400);
  missingValidation(restaurant_id, 'Restaurant ID', 400);

  const userTime = await queryOne(
    SQL`SELECT "budget_time" FROM "Users" WHERE "_id"=${user_id}`
  );
  missingValidation(userTime, '', 404, 'User not found');

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
    throw new ErrorException('Restaurant not found', 404);
  }

  // if there is a defined time, go with it unless
  // go with user's
  time = time || userTime.budget_time;

  if (time === 'custom') {
    missingValidation(startTime, 'Start Date', 400);
    missingValidation(endTime, 'End Date', 400);
    isValidDate(startTime, 'Start');
    isValidDate(endTime, 'End');
  }

  const queryVisitsCount = SQL`
    SELECT count(*)
    FROM "Visits"
    WHERE
      "restaurant_id"=${restaurant_id} AND
      "user_id"=${user_id}
  `;
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
  queryVisits.append(getTime({ time, startTime, endTime }));
  queryVisits.append(SQL`ORDER BY "visited_at" DESC`);
  const visits = await queryRows(queryVisits);

  queryVisitsCount.append(getTime({ time, startTime, endTime }));
  const { count } = await queryOne(queryVisitsCount);

  return {
    total: count,
    data: {
      Restaurant: restaurants,
      Visits: visits.map((item) => format.visit.time(item)),
    },
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
