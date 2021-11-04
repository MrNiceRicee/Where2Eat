const SQL = require('sql-template-strings');
const { deleteItem } = require('../jobs');
const { queryOne, query, queryRows } = require('../../helpers');
const { expect } = require('chai');

describe('Users Delete Item', () => {
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

  it('Error no ID', () => {
    deleteItem()
      .then(() => {
        expect(true).to.be.false; // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).to.deep.equal({
          message: 'Missing ID',
          statusCode: 400,
        });
      });
  });

  it('Error no user found', () => {
    deleteItem(-100, { update: { name: 'should fail' } })
      .then(() => {
        expect(true).to.be.false; // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).to.deep.equal({
          data: 'No User found',
          statusCode: 400,
        });
      });
  });

  it('Delete One', async () => {
    const result = await deleteItem(users.one._id);
    expect(result).to.deep.equal({
      data: 'Deleted User',
    });
  });

  it('Check in DB', async () => {
    await deleteItem(users.one._id);
    const result = await queryRows(SQL`SELECT * FROM "Users"`);
    expect(result.length).to.equal(1);
    expect(result).to.deep.include.members([users.two]);
  });
});
