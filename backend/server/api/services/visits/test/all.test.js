const SQL = require('sql-template-strings');
const { all, create } = require('../jobs');
const { create: createUsers } = require('../../users/jobs');
const { queryOne, query } = require('../../helpers');
const { expect } = require('chai');
const { create: helpCreate } = require('../../helpers/test')

describe('Visits All', () => {
  let data = {
    users: {},
    visits: {},
    restaurants: {},
  };
  beforeEach(async () => {
    data.users.one = await helpCreate.user('josh');
    data.users.two = await helpCreate.user('nicole');
    data.restaurants.one = await helpCreate.restaurant();
    data.restaurants.one = await helpCreate.restaurant();
  });

  afterEach(async () => {
    await query(SQL`DELETE FROM "Users"`);
  });

  it('shows All', async () => {
    console.log(data);
    const result = await all();
    console.log(result);
  });
});
