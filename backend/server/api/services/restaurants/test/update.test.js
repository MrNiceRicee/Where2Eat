const SQL = require('sql-template-strings');
const { update } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { create, delete: Delete } = require('../../helpers/test');
const { expect } = require('chai');

describe('Restaurants Update', () => {
  let data = {};
  beforeEach(async () => {
    data.one = await create.restaurant({ name: 'Basic Noodles' });
    data.two = await create.restaurant({ name: 'Basic Restaurant' });
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

  it('error no restaurant', async () => {
    try {
      await update(1, { hello: 'yeep' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'No Restaurant found',
        statusCode: 204,
      });
    }
  });

  it('error Invalid Update', async () => {
    try {
      await update(data.one._id, { hello: 'world!' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Invalid Update',
        statusCode: 400,
      });
    }
  });

  it('error Missing Update', async () => {
    try {
      await update(data.one._id, { name: '' });
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equals({
        message: 'Missing Update Details',
        statusCode: 400,
      });
    }
  });

  it('success! one update', async () => {
    await update(data.one._id, { name: `Eonni's noodles` });
    const result = await queryOne(
      SQL`SELECT * FROM "Restaurants" WHERE "_id"=${data.one._id}`
    );
    expect(result.name).to.equal("Eonni's noodles");
  });

  it('success! one update', async () => {
    await update(data.one._id, { name: `Eonni's noodles`, rating: 5 });
    const result = await queryOne(
      SQL`SELECT * FROM "Restaurants" WHERE "_id"=${data.one._id}`
    );
    expect(result.name).to.equal("Eonni's noodles");
    expect(result.rating).to.equal("5");
  });
});
