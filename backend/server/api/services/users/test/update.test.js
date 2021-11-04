const SQL = require('sql-template-strings');
const { update } = require('../jobs');
const { queryOne, query } = require('../../helpers');
const { expect } = require('chai');

describe('Users Update', () => {
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

  it('Error no ID', async () => {
    try {
      await update();
      expect(true).to.be.false; // just in case it doesn't fail
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Missing ID',
        statusCode: 400,
      });
    }
  });

  it('Error no update package', async () => {
    try {
      await update(users.one._id);
      expect(true).to.be.false; // just in case it doesn't fail
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Missing update package',
        statusCode: 400,
      });
    }
  });

  it('Error no user found', async () => {
    try {
      await update(-100, { update: { name: 'should fail' } });
      expect(true).to.be.false; // just in case it doesn't fail
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'No User found',
        statusCode: 204,
      });
    }
  });

  it('Error Update package', async () => {
    try {
      await update(users.one._id, { update: { banana: 'Updated Name' } });
      expect(true).to.be.false; // just in case it doesn't fail
    } catch (err) {
      expect(err).to.deep.equal({
        message: 'Invalid Update',
        statusCode: 400,
      });
    }
  });

  it('Update name', async () => {
    await update(users.one._id, { update: { name: 'Updated Name' } });
    const find = await queryOne(
      SQL`SELECT * FROM "Users" WHERE "_id"=${users.one._id}`
    );
    expect(find.name).to.equal('Updated Name');
  });

  it('Update multiple', async () => {
    await update(users.two._id, {
      update: { name: 'Updated Name2', budget: 49.99, budget_time: 'weekly' },
    });
    const find = await queryOne(
      SQL`SELECT * FROM "Users" WHERE "_id"=${users.two._id}`
    );
    expect(find.name).to.equal('Updated Name2');
    expect(find.budget).to.equal('49.99');
    expect(find.budget_time).to.equal('weekly');
  });
});
