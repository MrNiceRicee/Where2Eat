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

  it('Create One', async () => {
    const result = await create({ name: 'test_one' });
    expect(result).to.be.a('object');
    expect(result.data.name).to.equal('test_one');
    expect(result.data).to.deep.equal({
      name: 'test_one',
      total_visited_restaurants: 0,
      total_visits: 0,
      spent: '0',
      budget: '0',
      budget_time: 'weekly',
    });
  });

  it('Check in DB', async () => {
    await create({ name: 'test_one' });
    const result = await queryOne(SQL`SELECT * FROM "Users"`);
    expect(result).to.be.a('object');
    expect(result.name).to.equal('test_one');
  });
});
