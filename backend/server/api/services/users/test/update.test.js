const SQL = require('sql-template-strings');
const update = require('../update');
const { queryOne, query } = require('../../helpers');

describe('Users Update', () => {
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
    update()
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

  test('Error no update package', () => {
    update(users.one._id)
      .then(() => {
        expect(true).toEqual(false); // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).toEqual(
          expect.objectContaining({
            message: 'Missing update package',
            statusCode: 500,
          })
        );
      });
  });

  test('Update name', async () => {
    await update(users.one._id, { update: { name: 'Updated Name' } });
    const find = await queryOne(
      SQL`SELECT * FROM "Users" WHERE "_id"=${users.one._id}`
    );
    expect(find.name).toEqual('Updated Name');
  });

  test('Update multiple', async () => {
    await update(users.one._id, { update: { name: 'Updated Name', budget: 49.99, budget_time: 'weekly' } });
    const find = await queryOne(
      SQL`SELECT * FROM "Users" WHERE "_id"=${users.one._id}`
    );
    expect(find.name).toEqual('Updated Name');
    expect(find.budget).toEqual('49.99');
    expect(find.budget_time).toEqual('weekly');
  });
});
