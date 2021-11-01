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

  // if there is a defined time, go with it unless
  // go with user's
  time = time || userTime;

  const queryVisits = SQL`
    SELECT
      "spent",
      "visited_at"
    FROM
      "Visits"
    WHERE 
      "restaurant_id"=${restaurant_id} AND
      "user_id"=${user_id}
  `;
  queryVisits.append(getTime(time));
  queryVisits.append(SQL`ORDER BY "visited_at" DESC`);
  let visits = await queryRows(queryVisits);
  visits = visits.map((item) => {
    const translatedDate = DateTime.fromJSDate(item.visited_at);
    const newTime = translatedDate.toFormat(
      'yyyy MMMM dd'
    );
    item.human_time = translatedDate.toRelative();
    if (translatedDate.hasSame(DateTime.now(), 'day')) {
      item.human_time = 'today';
    }
    item.visited_at = newTime;
    return item;
  });
  restaurants.Visits = visits;

  return {
    data: restaurants,
  };
};

const getTime = ({ budget_time: time }) => {
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
    default:
      return SQL` AND "visited_at" >= ${DateTime.now()
        .minus({ weeks: 1 })
        .toISODate()} AND
        "visited_at" <= ${DateTime.now().toISODate()}  
      `;
  }
};

module.exports = search;
