const SQL = require('sql-template-strings');
const { DateTime } = require('luxon');
const { queryOne, validation, ErrorException } = require('../../helpers');
const { missingValidation, numberValidation, isValidDate, isDefined } =
  validation;

const create = async ({ user_id, restaurant_id, spent, visited_at }) => {
  missingValidation(user_id, 'User ID', 400);
  missingValidation(restaurant_id, 'Restaurant ID', 400);

  if (isDefined(visited_at)) {
    try {
      isValidDate(visited_at, 'Visit');
      if (
        DateTime.fromISO(visited_at).toISODate() >
        DateTime.now().toISODate()
      ) {
        throw new ErrorException('Date cannot be set in the future', 400);
      }
    } catch (err) {
      throw err;
    }
  }

  numberValidation({
    operator: 'gt',
    name: 'Spent amount',
    validate: spent,
    compare: 0,
  });

  // verify user and restaurant

  const user = await queryOne(
    SQL` SELECT "_id", "name" FROM "Users" WHERE "_id"=${user_id}`
  );
  missingValidation(user, '', 404, 'User not found');
  const restaurant = await queryOne(
    SQL` SELECT "_id" , "name" FROM "Restaurants" WHERE "_id"=${restaurant_id}`
  );
  missingValidation(restaurant, '', 404, 'Restaurant not found');

  const query = SQL`
    INSERT INTO "Visits" ("user_id", "restaurant_id", "spent", "visited_at")
      VALUES(${user_id}, ${restaurant_id}, ${spent}, ${visited_at})
    RETURNING "visited_at"
    `;
  await queryOne(query);
  return { data: `Visit for ${user.name} created`};
};

module.exports = create;
