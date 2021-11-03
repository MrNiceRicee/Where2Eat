const SQL = require('sql-template-strings');
const Big = require('big.js');
const { create } = require('../jobs');
const { queryOne } = require('../../helpers');
const { expect } = require('chai');
const { create: helpCreate, delete: Delete } = require('../../helpers/test');

describe('Visits Create', () => {
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
  });

  afterEach(async () => {
    await Delete.all();
  });

  it('error no user', async () => {
    try {
      await create({});
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Missing User ID',
        statusCode: 400,
      });
    }
  });

  it('error no restaurant', async () => {
    try {
      await create({
        user_id: data.users.one._id,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Missing Restaurant ID',
        statusCode: 400,
      });
    }
  });

  it('error no spent', async () => {
    try {
      await create({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Missing Spent amount',
        statusCode: 400,
      });
    }
  });

  it('error spent not enough', async () => {
    try {
      await create({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
        spent: 0,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Spent amount must be > 0',
        statusCode: 400,
      });
    }
  });

  it('error User not found', async () => {
    try {
      await create({
        user_id: 1,
        restaurant_id: data.restaurants.one._id,
        spent: .1,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'User not found',
        statusCode: 204,
      });
    }
  });

  it('error Restaurant not found', async () => {
    try {
      await create({
        user_id: data.users.one._id,
        restaurant_id: 1,
        spent: .1,
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Restaurant not found',
        statusCode: 204,
      });
    }
  });

  it('should succeed', async () => {
    const spent = Big((Math.random() * 49.99).toFixed(2)).plus(1);
    await create({
      user_id: data.users.one._id,
      restaurant_id: data.restaurants.one._id,
      spent: spent.toNumber(),
    });
    const res = await queryOne(SQL`
      SELECT *
      FROM "Visits"
      WHERE "user_id"=${data.users.one._id}`);
    expect(res).to.be.a('object');
    expect(Big(res.user_id).eq(data.users.one._id)).to.be.true;
    expect(res.restaurant_id).to.equal(data.restaurants.one._id);
  });
});
