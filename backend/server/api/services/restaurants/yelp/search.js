const axios = require('axios');
const { ErrorException } = require('../../helpers');
const { AUTH_YELP } = require('./config');
const { fakeYelp } = require('../test/fakeYelpData');

const search = async ({
  term,
  location,
  latitude,
  longitude,
  radius = 25000, // about 15 miles
  categories,
  offset,
  sort_by,
  price,
  open_now,
} = {}) => {
  if (!location && !latitude && !longitude)
    throw new ErrorException('Missing location requirements', 500);

  // fake test so we don't use YELP API :)
  if (process.env.RUN_ENV === 'test') {
    return fakeYelp;
  }
  const yelp = await axios({
    method: 'get',
    url: 'https://api.yelp.com/v3/businesses/search',
    params: {
      term,
      location,
      latitude,
      longitude,
      radius,
      categories,
      offset,
      sort_by,
      price,
      open_now,
      limit: 5,
    },
    headers: {
      Authorization: AUTH_YELP,
    },
  });

  return {
    data: yelp.data.businesses,
    count: yelp.data.total,
  };
};

module.exports = search;
