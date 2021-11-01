const SQL = require('sql-template-strings');
const { all } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { delete: Delete } = require('../../helpers/test');
const { expect } = require('chai');

describe('Users All', () => {
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
    await Delete.users();
  });

  it('shows All', async () => {
    const result = await all();
    expect(result).to.deep.equal({
      total: 2,
      data: [users.one, users.two],
    });
  });
});
