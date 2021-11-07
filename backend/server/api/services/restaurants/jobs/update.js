const SQL = require('sql-template-strings');
const { queryOne, ErrorException, validation } = require('../../helpers');
const { missingValidation } = validation;
const editable = {
  name: true,
  image_url: true,
  location: true,
  category: true,
  price: true,
  rating: true,
  review_count: true,
  url: true,
};

const update = async (id, update) => {
  missingValidation(id, 'ID', 400);
  missingValidation(update, 'Update Package', 400);

  const checkDB = await queryOne(
    SQL`SELECT "_id", "name" FROM "Restaurants" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No Restaurant found', 204);

  let query = SQL`
  UPDATE "Restaurants"
    SET `;

  const updateKeys = Object.keys(update);
  updateKeys.forEach((item) => {
    if (!editable[item]) {
      throw new ErrorException('Invalid Update', 400);
    }
    if (!update[item]) {
      throw new ErrorException('Missing Update Details', 400);
    }
    query.append(` ${item}`);
    query.append(SQL`=${update[item]} `);
  });
  const filter = SQL` WHERE "_id"=${id} `;
  query.append(filter);
  await queryOne(query);
  return {
    message: 'Updated Restaurant',
  };
};

module.exports = update;
