const SQL = require('sql-template-strings');
const { search } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { expect } = require('chai');

describe('Users Search', () => {
  let users = {};
  beforeEach(async () => {
    users.one = await queryOne(
      SQL`INSERT INTO "Users" ("name") VALUES('test_user1') RETURNING *`
    );
    users.two = await queryOne(
      SQL`INSERT INTO "Users" ("name") VALUES('test_user2') RETURNING *`
    );
  });

  afterEach(async () => {
    await query(SQL`DELETE FROM "Users"`);
  });

  it('Error no search', () => {
    search()
      .then(() => {
        expect(true).to.be.false; // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).to.deep.equal({
          message: 'Missing search requirements',
          statusCode: 400,
        });
      });
  });

  it('Search one', async () => {
    const result = await search({ id: users.one._id });
    expect(result).to.deep.equal({
      total: 1,
      data: [users.one],
    });
  });

  it('Search two', async () => {
    const result = await search({ name: 'test' });
    expect(result).to.be.a('object');
    expect(result.total).to.equal(2);
    expect(result.data).to.deep.include.members([users.one, users.two]);
  });

  it('Search one strict', async () => {
    const result = await search({ name: 'test_user2', strict: true });
    expect(result).to.deep.equal({
      total: 1,
      data: [users.two],
    });
  });
});
