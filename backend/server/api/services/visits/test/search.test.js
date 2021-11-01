const SQL = require('sql-template-strings');
const { search } = require('../jobs');
const { queryOne } = require('../../helpers');
const { expect } = require('chai');
const { create: helpCreate, delete: Delete } = require('../../helpers/test');
const { DateTime } = require('luxon');

describe('Visits Search', () => {
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
      (Math.random() * 49.99).toFixed(2),
      DateTime.now().minus({ months: 2 }).toISODate()
    );
    data.visits.two = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.two._id,
      (Math.random() * 49.99).toFixed(2),
      );
      data.visits.three = await helpCreate.visit(
        data.users.two._id,
        data.restaurants.one._id,
        (Math.random() * 49.99).toFixed(2),
        DateTime.now().minus({ days: 1 }).toISODate()
    );
  });

  afterEach(async () => {
    await Delete.all();
  });

  it('error on user ID', async () => {
    try {
      await search({});
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Missing User ID',
        statusCode: 400,
      });
    }
  });

  it('error on Restaurant ID', async () => {
    try {
      await search({ user_id: 1 });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Missing Restaurant ID',
        statusCode: 400,
      });
    }
  });

  it('error user not found', async () => {
    try {
      await search({
        user_id: 1,
        restaurant_id: 1,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'User not found',
        statusCode: 204,
      });
    }
  });

  it('error restaurant not found', async () => {
    try {
      await search({
        user_id: data.users.one._id,
        restaurant_id: 1,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Restaurant not found',
        statusCode: 204,
      });
    }
  });

  it('success!', async () => {
    const res = await search({
      user_id: data.users.one._id,
      restaurant_id: data.restaurants.one._id,
    });
    console.log('data', res.data);
  });
});
