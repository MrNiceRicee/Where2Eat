const SQL = require('sql-template-strings');
const search = require('../search');
const { queryOne, query } = require('../../helpers');

describe('Users Search', () => {
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

  test('Error no search', () => {
    search()
      .then(() => {
        expect(true).toEqual(false); // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).toEqual(
          expect.objectContaining({
            message: 'Missing search requirements',
            statusCode: 500,
          })
        );
      });
  });

  test('Search one', async () => {
    const result = await search({ id: users.one._id });
    expect(result).toEqual(
      expect.objectContaining({
        total: 1,
        data: expect.arrayContaining([users.one]),
      })
    );
  });

  test('Search two', async () => {
    const result = await search({ name: 'test' });
    expect(result).toEqual(
      expect.objectContaining({
        total: 2,
        data: expect.arrayContaining([users.one, users.two]),
      })
    );
  });

  test('Search one strict', async () => {
    const result = await search({ name: 'test_user2', strict: true });
    expect(result).toEqual(
      expect.objectContaining({
        total: 1,
        data: expect.arrayContaining([users.two]),
      })
    );
  });
});
