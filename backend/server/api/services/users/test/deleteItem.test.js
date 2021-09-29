const SQL = require('sql-template-strings');
const deleteItem = require('../deleteItem');
const { queryOne, query, queryRows } = require('../../helpers');

describe('Users Delete Item', () => {
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

  test('Error no ID', () => {
    deleteItem()
      .then(() => {
        expect(true).toEqual(false); // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).toEqual(
          expect.objectContaining({
            message: 'Missing ID',
            statusCode: 500,
          })
        );
      });
  });

  test('Error no user found', () => {
    deleteItem(-100, { update: { name: 'should fail' } })
      .then(() => {
        expect(true).toEqual(false); // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).toEqual(
          expect.objectContaining({
            message: 'No User found',
            statusCode: 500,
          })
        );
      });
  });

  test('Delete One', async () => {
    const result = await deleteItem(users.one._id);
    expect(result).toEqual(
      expect.objectContaining({
        message: 'Deleted User',
      })
    );
  });

  test('Check in DB', async () => {
    const result = await queryRows(SQL`SELECT * FROM "Users"`);
    expect(result.length).toEqual(1);
    expect(result).toEqual(
      expect.not.objectContaining({
        name: users.one.name,
      })
    );
  });
});
