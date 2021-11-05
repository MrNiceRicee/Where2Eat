const SQL = require('sql-template-strings');
const Big = require('big.js');
const { queryOne, validation } = require('../../helpers');
const { missingValidation, numberValidation } = validation;

const create = async ({ user_id, restaurant_id, spent }) => {
  missingValidation(user_id, 'User ID', 400);
  missingValidation(restaurant_id, 'Restaurant ID', 400);

  numberValidation({
    operator: 'gt',
    name: 'Spent amount',
    validate: spent,
    compare: 0,
  });

  // verify user and restaurant

  const user = await queryOne(
    SQL` SELECT "_id" FROM "Users" WHERE "_id"=${user_id}`
  );
  missingValidation(user, '', 204, 'User not found');
  const restaurant = await queryOne(
    SQL` SELECT "_id" FROM "Restaurants" WHERE "_id"=${restaurant_id}`
  );
  missingValidation(restaurant, '', 204, 'Restaurant not found');

  const query = SQL`
    INSERT INTO "Visits" ("user_id", "restaurant_id", "spent")
      VALUES(${user_id}, ${restaurant_id}, ${spent})
    `;
  const data = await queryOne(query);
  return data;
};

module.exports = create;
