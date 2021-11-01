const SQL = require('sql-template-strings');
const Big = require('big.js');
const { queryOne, validation } = require('../../helpers');
const { missingValidation, numberValidation } = validation;

const create = async ({ user_id, restaurant_id, spent }) => {
  missingValidation(user_id, 'User ID', 400);
  missingValidation(restaurant_id, 'Restaurant ID', 400);

  numberValidation({
    operator: 'gt',
    itemName: 'Spent amount',
    validateNumber: spent,
    compareNumber: 0,
  });

  const query = SQL`
    INSERT INTO "Visits" ("user_id", "restaurant_id", "spent")
      VALUES(${user_id}, ${restaurant_id}, ${spent})
    `;
  const data = await queryOne(query);
  return data;
};

module.exports = create;
