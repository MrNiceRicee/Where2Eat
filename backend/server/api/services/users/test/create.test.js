const SQL = require('sql-template-strings');
const { create } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { expect } = require('chai');

describe('Users Create', () => {
  beforeEach(async () => {});

  afterEach(async () => {
    await query(SQL`DELETE FROM "Users"`);
  });

  it('Create One', async () => {
    const result = await create({ name: 'test_one' });
    expect(result).to.be.a('object');
    expect(result.name).to.equal('test_one');
  });

  it('Check in DB', async () => {
    await create({ name: 'test_one' });
    const result = await queryOne(SQL`SELECT * FROM "Users"`);
    expect(result).to.be.a('object');
    expect(result.name).to.equal('test_one');
  });

  it('Error no Name', async () => {
    await create().catch((err) => {
      expect(err).to.deep.equal({ message: 'Missing Name', statusCode: 400 });
    });
  });
});
