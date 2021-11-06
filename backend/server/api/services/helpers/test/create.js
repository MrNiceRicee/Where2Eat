const SQL = require('sql-template-strings');
const faker = require('faker');
const { DateTime } = require('luxon');
const { queryOne } = require('../');
const Big = require('big.js');

const restaurant = async ({ name, rating, review_count } = {}) => {
  const cost = ['$', '$$', '$$$'];
  const decimals = [0, 0.25, 0.5, 0.75, 1];
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
        ${cost[faker.datatype.number(cost.length - 1)]},
        ${rating || Big(faker.datatype.number(4)).plus(
          decimals[faker.datatype.number(decimals.length - 1)]
        ).toNumber()},
        ${review_count || faker.datatype.number(10000)},
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
  spent = faker.datatype.number(49),
  time = DateTime.now().toISODate()
) => {
  const decimals = [0, 0.25, 0.49, 0.5, 0.75, 0.9, 0.99];
  const query = SQL`
    INSERT INTO "Visits"("user_id", "restaurant_id", "spent", "visited_at")
    VALUES(
      ${user_id},
      ${restaurant_id},
      ${
        spent ||
        Big(faker.datatype.number(49)).plus(
          decimals[faker.datatype.number(decimals.length - 1)]
        ).toNumber()
      },
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
