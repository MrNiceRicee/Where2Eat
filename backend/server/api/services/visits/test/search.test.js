const SQL = require('sql-template-strings');
const Big = require('big.js');
const { DateTime } = require('luxon');
const { expect } = require('chai');
const { search } = require('../jobs');
const { queryOne, validation } = require('../../helpers');
const { testing } = validation;
const { create: helpCreate, delete: Delete } = require('../../helpers/test');
const { format } = require('../util');

describe('Visits Search', () => {
  let data = {
    users: {},
    visits: {},
    restaurants: {},
  };
  beforeEach(async () => {
    data.users.one = await helpCreate.user({ budget_time: 'daily' });
    data.users.two = await helpCreate.user();
    data.restaurants.one = await helpCreate.restaurant();
    data.restaurants.two = await helpCreate.restaurant();
    data.visits.one = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.one._id,
      (Math.random() * 49.99).toFixed(2),
      DateTime.now().minus({ months: 1 }).toISODate()
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
    data.visits.four = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.one._id,
      (Math.random() * 49.99).toFixed(2),
      DateTime.now().toISODate()
    );
    data.visits.five = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.one._id,
      (Math.random() * 49.99).toFixed(2),
      DateTime.now().minus({ days: 1 }).toISODate()
    );
    data.visits.six = await helpCreate.visit(
      data.users.one._id,
      data.restaurants.one._id,
      (Math.random() * 49.99).toFixed(2),
      DateTime.now().minus({ week: 1 }).toISODate()
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
        statusCode: 404,
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
        statusCode: 404,
      });
    }
  });

  it('Invalid time', async () => {
    try {
      const res = await search({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
        time: 'oopsies',
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Invalid Time',
        statusCode: 400,
      });
    }
  });

  it('error! custom date missing start', async () => {
    try {
      await search({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
        time: 'custom',
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Missing Start Date',
        statusCode: 400,
      });
    }
  });

  it('error! custom date missing end', async () => {
    try {
      await search({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
        time: 'custom',
        startTime: '1',
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Missing End Date',
        statusCode: 400,
      });
    }
  });

  it('error! custom, invalid start', async () => {
    try {
      await search({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
        time: 'custom',
        startTime: '1',
        endTime: '1',
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Invalid Start Date',
        statusCode: 400,
      });
    }
  });

  it('error! custom, invalid end', async () => {
    try {
      await search({
        user_id: data.users.one._id,
        restaurant_id: data.restaurants.one._id,
        time: 'custom',
        startTime: '2015-10-01',
        endTime: '1',
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.a('object');
      expect(err).to.deep.equal({
        message: 'Invalid End Date',
        statusCode: 400,
      });
    }
  });

  it('success! user default (daily)', async () => {
    const res = await search({
      user_id: data.users.one._id,
      restaurant_id: data.restaurants.one._id,
      // time: 'monthly',
    });
    expect(Big(res.total).eq(2)).true;
    expect(Big(getVisitTotal(res.data.Visits)).eq(res.data.Visits_Spent)).true;
    validateRestaurant(res.data.Restaurant, data.restaurants.one);
    expect(res.data.Visits.length).to.equal(2);
    expect(res.data.Visits).to.deep.include.members([
      format.visit.time(data.visits.four),
      format.visit.time(data.visits.five),
    ]);
  });

  it('success! weekly', async () => {
    const res = await search({
      user_id: data.users.one._id,
      restaurant_id: data.restaurants.one._id,
      time: 'weekly',
    });
    validateRestaurant(res.data.Restaurant, data.restaurants.one);
    expect(res.data.Visits.length).to.equal(3);
    expect(Big(getVisitTotal(res.data.Visits)).eq(res.data.Visits_Spent)).true;
    expect(res.data.Visits).to.deep.include.members([
      format.visit.time(data.visits.four),
      format.visit.time(data.visits.five),
      format.visit.time(data.visits.six),
    ]);
  });

  it('success! monthly', async () => {
    const res = await search({
      user_id: data.users.one._id,
      restaurant_id: data.restaurants.one._id,
      time: 'monthly',
    });
    validateRestaurant(res.data.Restaurant, data.restaurants.one);
    expect(Big(getVisitTotal(res.data.Visits)).eq(res.data.Visits_Spent)).true;
    expect(res.data.Visits.length).to.equal(4);
    expect(res.data.Visits).to.deep.include.members([
      format.visit.time(data.visits.four),
      format.visit.time(data.visits.five),
      format.visit.time(data.visits.six),
      format.visit.time(data.visits.one),
    ]);
  });

  it('success! custom', async () => {
    const res = await search({
      user_id: data.users.one._id,
      restaurant_id: data.restaurants.one._id,
      time: 'custom',
      startTime: DateTime.now().minus({ months: 2 }).toISODate(),
      endTime: DateTime.now().minus({ days: 24 }).toISODate(),
    });
    validateRestaurant(res.data.Restaurant, data.restaurants.one);
    expect(Big(getVisitTotal(res.data.Visits)).eq(res.data.Visits_Spent)).true;
    expect(res.data.Visits.length).to.equal(1);
    expect(res.data.Visits).to.deep.include.members([
      format.visit.time(data.visits.one),
    ]);
  });
});

const validateRestaurant = (validate, compare) => {
  expect(validate._id).to.equal(compare._id);
  expect(validate.name).to.equal(compare.name);
  expect(validate.image_url).to.equal(compare.image_url);
  expect(validate.location).to.deep.equal(compare.location);
  expect(validate.category).to.deep.include.members(compare.category);
  expect(validate.price).to.equal(compare.price);
  expect(validate.rating).to.equal(compare.rating);
  expect(validate.review_count).to.equal(compare.review_count);
  expect(validate.url).to.equal(compare.url);
};

const getVisitTotal = (visits) => {
  return visits.reduce(
    (prev, curr) => Big(prev).plus(curr.spent).toNumber(),
    0
  );
};
