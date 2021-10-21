const search = require('../search');

describe('Restaurant Search', () => {
  const data = {};
  beforeAll(async () => {});

  afterAll(async () => {});

  test('Error no search', () => {
    search()
      .then(() => {
        expect(true).toEqual(false); // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).toEqual(
          expect.objectContaining({
            message: 'Missing location requirements',
            statusCode: 500,
          })
        );
      });
  });

  test('Search one', async () => {
    const result = await search({
      term: 'korean',
      location: '5730 N 107th Ln, Phoenix, Arizona 85037',
    });
    console.log(result);
  });
});
