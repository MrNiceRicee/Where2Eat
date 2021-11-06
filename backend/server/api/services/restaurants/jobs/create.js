const SQL = require('sql-template-strings');
const { queryOne, ErrorException } = require('../../helpers');
const { missingValidation } = require('../../helpers/validation');

const create = async ({
  _id,
  name,
  image_url,
  location,
  category,
  price,
  rating,
  review_count,
  url,
} = {}) => {
  missingValidation(_id, 'ID', 400);
  missingValidation(name, 'Name', 400);
  missingValidation(image_url, 'Image_url', 400);
  missingValidation(location, 'Location', 400);
  missingValidation(category, 'Category', 400);
  missingValidation(price, 'Price', 400);
  missingValidation(rating, 'Rating', 400);
  missingValidation(review_count, 'Review Count', 400);
  missingValidation(url, 'URL', 400);
  const query = SQL`
    INSERT INTO "Restaurants" (
      "_id",
      "name",
      "image_url",
      "location",
      "category",
      "price",
      "rating",
      "review_count",
      "url"
    )
    VALUES(
      ${_id},
      ${name},
      ${image_url},
      ${location},
      ${category},
      ${price},
      ${rating},
      ${review_count},
      ${url}
    )
    RETURNING *
    `;
  const res = await queryOne(query);
  return res;
};

module.exports = create;
