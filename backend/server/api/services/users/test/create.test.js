const SQL = require('sql-template-strings');
const { create } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { expect } = require('chai');

describe('Users Create', () => {
  beforeEach(async () => {});

  afterEach(async () => {
    await query(SQL`DELETE FROM "Users"`);
  });

  it('Error no Name', async () => {
    try {
      await create();
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Missing Name',
        statusCode: 400,
      });
    }
  });

  it('Error budget too low', async () => {
    try {
      await create({name: 'test_one', budget: -1});
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Budget must be > 0',
        statusCode: 400,
      });
    }
  });

  it('Error Incorrect budget time', async () => {
    try {
      await create({name: 'test_one', budget_time: 'yearly'});
      expect(true).to.be.false;
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Invalid entry - Budget Time',
        statusCode: 400,
      });
    }
  });

  it('Create One', async () => {
    const result = await create({ name: 'test_one', budget_time: 'daily' });
    expect(result).to.be.a('object');
    expect(result.data.name).to.equal('test_one');
    expect(result.data).to.deep.equal({
      name: 'test_one',
      total_visited_restaurants: 0,
      total_visits: 0,
      spent: '0',
      budget: '75',
      budget_time: 'daily',
    });
  });

  it('Check in DB', async () => {
    await create({ name: 'test_one' });
    const result = await queryOne(SQL`SELECT * FROM "Users"`);
    expect(result).to.be.a('object');
    expect(result.name).to.equal('test_one');
  });
});
