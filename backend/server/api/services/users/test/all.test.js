const SQL = require('sql-template-strings');
const all = require('../all');
const { queryOne, query } = require('../../helpers');

describe('Users All', () => {
  let users = {};
  beforeAll(async () => {
    users.one = await queryOne(
      SQL`INSERT INTO "Users" ("name") VALUES('test_user1') RETURNING *`
    );
    users.two = await queryOne(
      SQL`INSERT INTO "Users" ("name") VALUES('test_user2') RETURNING *`
    );
  });

  afterAll(async () => {
    await query(SQL`DELETE FROM "Users"`);
  });

  test('shows All', async () => {
    const result = await all();
    expect(result).toEqual(
      expect.objectContaining({
        total: 2,
        data: expect.arrayContaining([users.one, users.two]),
      })
    );
  });
});
