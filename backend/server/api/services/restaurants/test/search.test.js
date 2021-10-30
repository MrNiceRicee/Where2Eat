const { expect } = require('chai');
const search = require('../job/search');
const { fakeYelp } = require('./fakeYelpData');

describe('Restaurant Search', () => {
  const data = {};
  beforeEach(async () => {
  });

  afterEach(async () => {
  });

  it('Error no search', () => {
    search
      .search()
      .then(() => {
        expect(true).toEqual(false); // just in case it doesn't fail
      })
      .catch((err) => {
        expect(err).deep.equal({
          message: 'Missing location requirements',
          statusCode: 400,
        });
      });
  });

  it('Search one', async () => {
    const result = await search.search({
      term: 'korean',
      location: '5730 N 107th Ln, Phoenix, Arizona 85037',
    });
    expect(result).to.deep.equal(fakeYelp);
  });
});
