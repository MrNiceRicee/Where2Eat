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
    SQL`SELECT "_id" FROM "Restaurants" WHERE "_id"=${id}`
  );
  if (!checkDB) throw new ErrorException('No Restaurant found', 204);

  let query = SQL`
  UPDATE "Restaurants"
    SET `;

  const updateKeys = Object.keys(update);
  const validated = [];
  updateKeys.forEach((item) => {
    if (!editable[item]) {
      throw new ErrorException('Invalid Update', 400);
    }
    if (!update[item]) {
      throw new ErrorException('Missing Update Details', 400);
    }
    validated.push(item);
  });
  validated.forEach((item, index) => {
    query.append(` ${item}=`);
    query.append(SQL`${update[item]}`);
    if (index < validated.length - 1) {
      query.append(',');
    }
  });
  const filter = SQL` WHERE "_id"=${id} `;
  query.append(filter);
  await queryOne(query);
  return {
    message: 'Updated Restaurant',
  };
};

module.exports = update;
