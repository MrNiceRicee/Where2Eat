const SQL = require('sql-template-strings');
const { all, create } = require('../jobs');
const { create: createUsers } = require('../../users/jobs');
const { queryOne, query } = require('../../helpers');
const { expect } = require('chai');
const { create: helpCreate } = require('../../helpers/test');

describe('Visits All', () => {
  let data = {
    users: {},
    visits: {},
    restaurants: {},
  };
  beforeEach(async () => {
    data.users.one = await helpCreate.user();
    data.users.two = await helpCreate.user();
    data.restaurants.one = await helpCreate.restaurant();
    data.restaurants.two = await helpCreate.restaurant();
    data.visits.one = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.one._id,
      Math.random() * 49.99
    );
  });

  afterEach(async () => {
    // await query(SQL`DELETE FROM "Users"`);
  });

  it('error no ID', async () => {
    try {
      await all({});
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Missing User ID',
        statusCode: 400,
      });
    }
  });

  it('All visits for one', async () => {
    const result = await all({ id: data.users.one._id });
    console.log(result);
  });
});
