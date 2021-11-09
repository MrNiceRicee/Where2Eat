const SQL = require('sql-template-strings');
const { update } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { create, delete: Delete } = require('../../helpers/test');
const { expect } = require('chai');
const { DateTime } = require('luxon');

describe('Visits Update', () => {
  let restaurants = {};
  let users = {};
  let visits = {};
  beforeEach(async () => {
    restaurants.one = await create.restaurant({ name: 'Basic Noodles' });
    restaurants.two = await create.restaurant({ name: 'Basic Restaurant' });
    users.one = await create.user({ name: 'josh' });
    users.two = await create.user({ name: 'nicole' });

    visits.one = await create.visit(users.one._id, restaurants.one._id, 49.99);
    visits.two = await create.visit(users.two._id, restaurants.two._id, 14.99);
  });

  afterEach(async () => {
    await Delete.all();
  });

  it('error no ID', async () => {
    try {
      await update('', {});
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Missing ID',
        statusCode: 400,
      });
    }
  });

  it('error no package', async () => {
    try {
      await update(1);
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Missing Update Package',
        statusCode: 400,
      });
    }
  });

  it('error no visit', async () => {
    try {
      await update(1, { hello: 'yeep' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'No Visit found',
        statusCode: 204,
      });
    }
  });

  it('error Invalid Update', async () => {
    try {
      await update(visits.one._id, { hello: 'world!' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Invalid Update',
        statusCode: 400,
      });
    }
  });

  // probably won't happen based on the error checkers
  // it('error Missing Update', async () => {
  //   try {
  //     await update(visits.one._id, { visited_at: '' });
  //     expect(true).to.be.false;
  //   } catch (err) {
  //     expect(err).to.be.an('object');
  //     expect(err).to.deep.equals({
  //       message: 'Missing Update Details',
  //       statusCode: 400,
  //     });
  //   }
  // });

  it('error bad spent format', async () => {
    try {
      await update(visits.one._id, { spent: 'hello!' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Invalid Spent',
        statusCode: 400,
      });
    }
  });

  it('error bad spent < 0', async () => {
    try {
      await update(visits.one._id, { spent: '-1' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Spent must be > 0',
        statusCode: 400,
      });
    }
  });

  it('error bad spent = 0', async () => {
    try {
      await update(visits.one._id, { spent: 0 });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Spent must be > 0',
        statusCode: 400,
      });
    }
  });

  it('error Visited', async () => {
    try {
      await update(visits.one._id, { visited_at: 0 });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Invalid Visit Date',
        statusCode: 400,
      });
    }
  });

  it('error Visited future', async () => {
    try {
      await update(visits.one._id, {
        visited_at: DateTime.now().plus({ days: 1 }).toISODate(),
      });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Date cannot be set in the future',
        statusCode: 400,
      });
    }
  });

  it('success! one update', async () => {
    await update(visits.one._id, { spent: 9.99 });
    const result = await queryOne(
      SQL`SELECT * FROM "Visits" WHERE "_id"=${visits.one._id}`
    );
    expect(result.spent).to.equal('9.99');
  });

  it('success! one update', async () => {
    await update(visits.two._id, {
      spent: 99.99,
      visited_at: '2015-10-01',
    });
    const result = await queryOne(
      SQL`SELECT * FROM "Visits" WHERE "_id"=${visits.two._id}`
    );
    expect(result.spent).to.equal('99.99');
    console.log(result.visited_at);

    expect(result.visited_at).to.equal(
      DateTime.fromISO('2015-10-01T07:00:00.000Z').toLocal()
    );
  });
});
