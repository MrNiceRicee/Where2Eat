const SQL = require('sql-template-strings');
const { queryOne } = require('../');
const faker = require('faker');

const restaurant = async () => {
  const cost = ['$', '$$', '$$$'];
  const query = SQL`INSERT INTO "Restaurants"(
      "_id",
      "name",
      "image_url",
      "location",
      "category",
      "price",
      "rating",
      "review_count",
      "url")

      VALUES(
        ${faker.datatype.uuid()},
        ${faker.company.companyName()},
        ${faker.image.food()},
        ${{
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: '',
          city: faker.address.cityName(),
          zip_code: faker.address.zipCodeByState('AZ'),
          country: 'US',
          state: 'AZ',
        }},
        ARRAY[${faker.music.genre()}, ${faker.music.genre()}, ${faker.music.genre()} ],
        ${cost[faker.datatype.number(2)]},
        ${faker.datatype.number({ min: 0.25, max: 5 })},
        ${faker.datatype.number(10000)},
        ${faker.image.fashion()}
      )

      RETURNING *`;

  const result = await queryOne(query);
  return result;
};

const user = async (name) => {
  const time = ['daily', 'weekly', 'monthly'];
  const query = SQL`INSERT INTO "Users"("name", "budget", "budget_time")
  VALUES(
    ${name || faker.name.findName()},
    ${faker.datatype.number({
      min: 20,
      max: 1000,
    })},
    ${time[faker.datatype.number(2)]})

    RETURNING *`;

  const result = await queryOne(query);
  return result;
};

const visit = async(user_id, restaurant_id) => {
  const query = SQL`INSERT INTO "Visits"("user_id", "restaurant_id", "name")`
}

module.exports = {
  restaurant,
  user,
};
