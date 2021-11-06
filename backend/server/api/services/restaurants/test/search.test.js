const { expect } = require('chai');
const search = require('../jobs/search');
const { fakeYelp } = require('./fakeYelpData');

describe('Restaurants Search', () => {
  const data = {};
  beforeEach(async () => {
  });

  afterEach(async () => {
  });

  it('Error no search', async () => {
    try {
      await search.search();
      expect(true).to.be.false;
    } catch(err) {
      expect(err).deep.equal({
        message: 'Missing location requirements',
        statusCode: 400,
      })
    }
  });

  it('Search one', async () => {
    const result = await search.search({
      term: 'korean',
      location: '5730 N 107th Ln, Phoenix, Arizona 85037',
    });
    expect(result).to.deep.equal(fakeYelp);
  });
});
