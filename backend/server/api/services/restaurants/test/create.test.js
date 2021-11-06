const SQL = require('sql-template-strings');
const faker = require('faker');
const Big = require('big.js');
const { create } = require('../jobs');
const { delete: Delete } = require('../../helpers/test');
const { expect } = require('chai');

describe('Restaurants Create', () => {
  beforeEach(async () => {});
  afterEach(async () => {
    await Delete.restaurants();
  });

  it('errors _id', async () => {
    try {
      await create({});
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing ID',
        statusCode: 400,
      });
    }
  });

  it('errors name', async () => {
    try {
      await create({ _id: faker.datatype.uuid() });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Name',
        statusCode: 400,
      });
    }
  });

  it('errors image_url', async () => {
    try {
      await create({ _id: faker.datatype.uuid(), name: "Eonni's Noodles" });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Image_url',
        statusCode: 400,
      });
    }
  });

  it('errors location', async () => {
    try {
      await create({
        _id: faker.datatype.uuid(),
        name: "Eonni's Noodles",
        image_url: faker.image.food(),
      });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Location',
        statusCode: 400,
      });
    }
  });

  it('errors category', async () => {
    try {
      await create({
        _id: faker.datatype.uuid(),
        name: "Eonni's Noodles",
        image_url: faker.image.food(),
        location: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: '',
          city: faker.address.cityName(),
          zip_code: faker.address.zipCodeByState('AZ'),
          country: 'US',
          state: 'AZ',
        },
      });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Category',
        statusCode: 400,
      });
    }
  });

  it('errors price', async () => {
    try {
      await create({
        _id: faker.datatype.uuid(),
        name: "Eonni's Noodles",
        image_url: faker.image.food(),
        location: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: '',
          city: faker.address.cityName(),
          zip_code: faker.address.zipCodeByState('AZ'),
          country: 'US',
          state: 'AZ',
        },
        category: [
          faker.music.genre(),
          faker.music.genre(),
          faker.music.genre(),
        ],
      });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Price',
        statusCode: 400,
      });
    }
  });

  it('errors Rating', async () => {
    const cost = ['$', '$$', '$$$'];
    try {
      await create({
        _id: faker.datatype.uuid(),
        name: "Eonni's Noodles",
        image_url: faker.image.food(),
        location: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: '',
          city: faker.address.cityName(),
          zip_code: faker.address.zipCodeByState('AZ'),
          country: 'US',
          state: 'AZ',
        },
        category: [
          faker.music.genre(),
          faker.music.genre(),
          faker.music.genre(),
        ],
        price: cost[faker.datatype.number(2)],
      });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Rating',
        statusCode: 400,
      });
    }
  });

  it('errors review count', async () => {
    const cost = ['$', '$$', '$$$'];
    const decimals = [0, 0.25, 0.5, 0.75, 1];
    const number = Big(faker.datatype.number(4))
      .plus(decimals[faker.datatype.number(decimals.length - 1)])
      .toNumber();
    try {
      await create({
        _id: faker.datatype.uuid(),
        name: "Eonni's Noodles",
        image_url: faker.image.food(),
        location: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: '',
          city: faker.address.cityName(),
          zip_code: faker.address.zipCodeByState('AZ'),
          country: 'US',
          state: 'AZ',
        },
        category: [
          faker.music.genre(),
          faker.music.genre(),
          faker.music.genre(),
        ],
        price: cost[faker.datatype.number(cost.length - 1)],
        rating: number,
      });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing Review Count',
        statusCode: 400,
      });
    }
  });

  it('errors URL', async () => {
    const cost = ['$', '$$', '$$$'];
    const decimals = [0, 0.25, 0.5, 0.75, 1];
    const number = Big(faker.datatype.number(4))
      .plus(decimals[faker.datatype.number(decimals.length - 1)])
      .toNumber();
    try {
      await create({
        _id: faker.datatype.uuid(),
        name: "Eonni's Noodles",
        image_url: faker.image.food(),
        location: {
          address1: faker.address.streetAddress(),
          address2: faker.address.secondaryAddress(),
          address3: '',
          city: faker.address.cityName(),
          zip_code: faker.address.zipCodeByState('AZ'),
          country: 'US',
          state: 'AZ',
        },
        category: [
          faker.music.genre(),
          faker.music.genre(),
          faker.music.genre(),
        ],
        price: cost[faker.datatype.number(cost.length - 1)],
        rating: number,
        review_count: faker.datatype.number(10000),
      });
    } catch (err) {
      expect(err).to.be.an('object');
      expect(err).to.deep.equal({
        message: 'Missing URL',
        statusCode: 400,
      });
    }
  });

  it('success!', async () => {
    const cost = ['$', '$$', '$$$'];
    const decimals = [0, 0.25, 0.5, 0.75, 1];
    const number = Big(faker.datatype.number(4))
      .plus(decimals[faker.datatype.number(decimals.length - 1)])
      .toString();
    const data = {
      _id: faker.datatype.uuid(),
      name: "Eonni's Noodles",
      image_url: faker.image.food(),
      location: {
        address1: faker.address.streetAddress(),
        address2: faker.address.secondaryAddress(),
        address3: '',
        city: faker.address.cityName(),
        zip_code: faker.address.zipCodeByState('AZ'),
        country: 'US',
        state: 'AZ',
      },
      category: [faker.music.genre(), faker.music.genre(), faker.music.genre()],
      price: cost[faker.datatype.number(cost.length - 1)],
      rating: number,
      review_count: faker.datatype.number(10000),
      url: faker.image.fashion(),
    }
    const result = await create(data);
    expect(result).to.deep.equal(data);
  });
});
