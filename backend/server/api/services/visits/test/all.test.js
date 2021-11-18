const Big = require('big.js');
const { expect } = require('chai');
const { all } = require('../jobs');
const { create: helpCreate, delete: Delete } = require('../../helpers/test');
const { format } = require('../util');

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
      await all({ id: -1 });
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
    expect(Big(getVisitTotal(result.data)).eq(result.totalSpend)).to.equal(
      true
    );
    expect(result.data).to.deep.include.members([
      convertVisit(data.visits.one, data.restaurants.one),
      convertVisit(data.visits.two, data.restaurants.two),
    ]);
  });
});

const convertVisit = (visit, restaurant, user) => ({
  Visit_spent: visit.spent,
  Visit_visited_at: visit.visited_at,
  Visit_human_time: format.visit.humanTime(visit.visited_at),
  Visit_id: visit._id,
  Restaurant_id: restaurant._id,
  Restaurant_name: restaurant.name,
  Restaurant_image_url: restaurant.image_url,
  Restaurant_price: restaurant.price,
  Restaurant_rating: restaurant.rating,
  Restaurant_review_count: restaurant.review_count,
  Restaurant_url: restaurant.url,
});

const getVisitTotal = (visits) => {
  return visits.reduce(
    (prev, curr) => Big(prev).plus(curr.Visit_spent).toNumber(),
    0
  );
};
