const SQL = require('sql-template-strings');
const faker = require('faker');
const { DateTime } = require('luxon');
const { queryOne } = require('../');

const restaurant = async ({ name } = {}) => {
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
        ${name || faker.company.companyName()},
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

const user = async ({ name, budget, budget_time } = {}) => {
  const time = ['daily', 'weekly', 'monthly'];
  const query = SQL`INSERT INTO "Users"("name", "budget", "budget_time")
  VALUES(
    ${name || faker.name.findName()},
    ${
      budget ||
      faker.datatype.number({
        min: 20,
        max: 1000,
      })
    },
    ${budget_time || time[faker.datatype.number(2)]})

    RETURNING *`;

  const result = await queryOne(query);
  return result;
};

const visit = async (
  user_id,
  restaurant_id,
  spent = faker.datatype.number(49.99),
  time = DateTime.now().toISODate()
) => {
  // time = time || DateTime.now().toISODate().toLocaleLowerCase('en-US');
  const query = SQL`
    INSERT INTO "Visits"("user_id", "restaurant_id", "spent", "visited_at")
    VALUES(
      ${user_id},
      ${restaurant_id},
      ${spent},
      ${time}
    )
    RETURNING *`;
  return await queryOne(query);
};

module.exports = {
  restaurant,
  user,
  visit,
};
