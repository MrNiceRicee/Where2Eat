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

  let query = `
  UPDATE "Restaurants"
    SET `;
  const values = [];
  
  const updateKeys = Object.keys(update);
  const acceptedKeys = updateKeys.map((item) => {
    if (!editable[item]) {
      throw new ErrorException('Invalid Update', 400);
    }
    let word = update[item];
    word = word.replaceAll("'", `\'`);
    values.push(word)
    return ` "${item}"=$${values.length} `;
  });
  const validKeys = acceptedKeys.join(' , ');
  query += validKeys
  values.push(id);
  const filter = ` WHERE "_id"=$${values.length} `;
  query += filter;
  console.log(query, values);

  await queryOne(query, values);
  return {
    message: 'Updated Restaurant',
  };
};

module.exports = update;
