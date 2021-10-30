const { ErrorException } = require('../../helpers');
const { search: yelpSearch } = require('../yelp');
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
    throw new ErrorException('Missing location requirements', 400);


  // fake test so we don't use YELP API :)
  if (process.env.RUN_ENV === 'test') {
    return fakeYelp;
  }
  const { data, count } = await yelpSearch({
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
  });

  return {
    data,
    count,
  };
};

module.exports = {
  search,
  yelpSearch,
};
