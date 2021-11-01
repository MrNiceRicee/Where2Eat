const SQL = require('sql-template-strings');
const { queryOne } = require('../');

const restaurants = async () => {
  const query = SQL`DELETE FROM "Restaurants"`;
  await queryOne(query);
};

const users = async () => {
  const query = SQL`DELETE FROM "Users"`;
  await queryOne(query);
};

const visits = async () => {
  const query = SQL`DELETE FROM "Visits"`;
  await queryOne(query);
};

const all = async () => {
  await visits();
  await restaurants();
  await users();
};

module.exports = {
  restaurants,
  users,
  visits,
  all,
};
