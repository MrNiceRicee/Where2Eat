const SQL = require('sql-template-strings');
const { all } = require('../jobs');
const { delete: Delete, create } = require('../../helpers/test');
const { expect } = require('chai');

describe('Restaurants All', () => {
  let restaurants = {};
  beforeEach(async () => {
    restaurants.one = await create.restaurant({
      name: "Eeonni's noodles",
      rating: '5',
      review_count: 400,
    });
    restaurants.two = await create.restaurant({
      name: 'Potato Corner',
      rating: '3',
      review_count: 100,
    });
    restaurants.three = await create.restaurant({
      name: 'Halo Halo Place',
      rating: '2',
      review_count: 50,
    });
  });

  afterEach(async () => {
    await Delete.restaurants();
  });

  it('shows all', async () => {
    const result = await all({});
    expect(result).to.deep.equal({
      total: 3,
      data: [restaurants.one, restaurants.two, restaurants.three],
    });
  });

  it('shows all order by rating DESC', async () => {
    const result = await all({
      order: JSON.stringify(['rating', 'DESC']),
    });
    expect(result.total).to.equal(3);
    expect(result.data).to.deep.equals([
      restaurants.one,
      restaurants.two,
      restaurants.three
    ]);
  });

  it('shows all order by rating ASC', async () => {
    const result = await all({
      order: JSON.stringify(['rating', 'ASC']),
    });
    expect(result.total).to.equal(3);
    expect(result.data).to.deep.equals([
      restaurants.three,
      restaurants.two,
      restaurants.one,
    ]);
  });
});
