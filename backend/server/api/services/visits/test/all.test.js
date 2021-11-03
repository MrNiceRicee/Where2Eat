const SQL = require('sql-template-strings');
const { all } = require('../jobs');
const { queryOne } = require('../../helpers');
const { expect } = require('chai');
const { create: helpCreate, delete: Delete } = require('../../helpers/test');

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
      (Math.random() * 49.99).toFixed(2)
    );
    data.visits.two = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.two._id,
      (Math.random() * 49.99).toFixed(2)
    );
    data.visits.three = await helpCreate.visit(
      data.users.two._id,
      data.restaurants.one._id,
      (Math.random() * 49.99).toFixed(2)
    );
  });

  afterEach(async () => {
    await Delete.all();
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

  it('error User not found', async () => {
    try {
      await all({});
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'User not found',
        statusCode: 400,
      });
    }
  });

  it('All visits for one', async () => {
    const result = await all({ id: data.users.one._id });
    expect(result).to.be.a('object');
    expect(result.total).to.equal(2);
    expect(result.data).to.deep.include.members([
      convertVisit(data.visits.one, data.restaurants.one, data.users.one),
      convertVisit(data.visits.two, data.restaurants.two, data.users.one),
    ]);
  });
});

const convertVisit = (visit, restaurant, user) => ({
  spent: visit.spent,
  visited_at: visit.visited_at,
  User_name: user.name,
  Restaurant_name: restaurant.name,
  Restaurant_image_url: restaurant.image_url,
  Restaurant_price: restaurant.price,
  Restaurant_rating: restaurant.rating,
  Restaurant_review_count: restaurant.review_count,
  Restaurant_url: restaurant.url,
});
