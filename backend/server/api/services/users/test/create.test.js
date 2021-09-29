const SQL = require('sql-template-strings');
const create = require('../create');
const { queryOne, query } = require('../../helpers');

describe('Users Create', () => {
  let users = {};
  beforeAll(async () => {});

  afterAll(async () => {
    await query(SQL`DELETE FROM "Users"`);
  });

  test('Create One', async () => {
    const result = await create({ name: 'test_one' });
    expect(result).toEqual(
      expect.objectContaining({
        message: 'Created User: test_one',
      })
    );
  });

  test('Check in DB', async () => {
    const result = await queryOne(SQL`SELECT * FROM "Users"`);
    expect(result).toEqual(expect.objectContaining({ name: 'test_one' }));
  });

  test('Error no Name', async () => {
    await create().catch((err) => {
      expect(err).toEqual(
        expect.objectContaining({
          message: 'Missing name',
          statusCode: 500,
        })
      );
    });
  });
});
