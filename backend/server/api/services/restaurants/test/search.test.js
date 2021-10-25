const { search, yelpSearch } = require('../job/search');
const { fakeYelp } = require('./fakeYelpData');

describe('Restaurant Search', () => {
  const data = {};
  beforeAll(async () => {
    jest.resetModules();
  });

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
   jest.mock('../yelp/search', () => ({
      data: [
        {
          id: 'S-oLPRdhlyL5HAknBKTUcQ',
          alias: 'harumi-sushi-and-sake-phoenix',
          name: 'Harumi Sushi & Sake',
          image_url:
            'https://s3-media1.fl.yelpcdn.com/bphoto/RGzWKj70FOLzl0wlFTshgA/o.jpg',
          is_closed: false,
          url: 'https://www.yelp.com/biz/harumi-sushi-and-sake-phoenix?adjust_creative=i1hPyi5HYwI4n_QmiuDiRg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=i1hPyi5HYwI4n_QmiuDiRg',
          review_count: 1801,
          categories: [
            {
              alias: 'japanese',
              title: 'Japanese',
            },
            {
              alias: 'sushi',
              title: 'Sushi Bars',
            },
            {
              alias: 'seafood',
              title: 'Seafood',
            },
          ],
          rating: 4.5,
          coordinates: {
            latitude: 33.4497491809777,
            longitude: -112.075330974205,
          },
          transactions: ['delivery'],
          price: '$$',
          location: {
            address1: '114 W Adams St',
            address2: 'Ste C101',
            address3: '',
            city: 'Phoenix',
            zip_code: '85003',
            country: 'US',
            state: 'AZ',
            display_address: [
              '114 W Adams St',
              'Ste C101',
              'Phoenix, AZ 85003',
            ],
          },
          phone: '+16022580131',
          display_phone: '(602) 258-0131',
          distance: 19017.54317176611,
        },
        {
          id: 'gogO5RF4Rqz2THF1ATcCew',
          alias: 'kabuki-japanese-restaurant-glendale',
          name: 'Kabuki Japanese Restaurant',
          image_url:
            'https://s3-media4.fl.yelpcdn.com/bphoto/nPPxG_5GTInqFKWcks_S1g/o.jpg',
          is_closed: false,
          url: 'https://www.yelp.com/biz/kabuki-japanese-restaurant-glendale?adjust_creative=i1hPyi5HYwI4n_QmiuDiRg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=i1hPyi5HYwI4n_QmiuDiRg',
          review_count: 846,
          categories: [
            {
              alias: 'japanese',
              title: 'Japanese',
            },
            {
              alias: 'sushi',
              title: 'Sushi Bars',
            },
            {
              alias: 'tapasmallplates',
              title: 'Tapas/Small Plates',
            },
          ],
          rating: 4,
          coordinates: {
            latitude: 33.5339543187941,
            longitude: -112.261047363281,
          },
          transactions: ['delivery', 'pickup'],
          price: '$$',
          location: {
            address1: '6770 N Sunrise Blvd',
            address2: 'Ste G211',
            address3: 'G211',
            city: 'Glendale',
            zip_code: '85305',
            country: 'US',
            state: 'AZ',
            display_address: [
              '6770 N Sunrise Blvd',
              'Ste G211',
              'G211',
              'Glendale, AZ 85305',
            ],
          },
          phone: '+16237729832',
          display_phone: '(623) 772-9832',
          distance: 5258.5145083127845,
        },
      ],
      count: 2,
    }));
    const result = await search({
      term: 'korean',
      location: '5730 N 107th Ln, Phoenix, Arizona 85037',
    });
    expect(result).toStrictEqual(fakeYelp);

  });
});
