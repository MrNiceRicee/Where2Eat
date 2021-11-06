const SQL = require('sql-template-strings');
const { queryRows, format } = require('../../helpers');
const { orderFormat } = format;

const all = async ({ order }) => {
  const query = SQL`
  SELECT  
    "_id",
    "name",
    "image_url",
    "location",
    "category",
    "price",
    "rating",
    "review_count",
    "url" 
  FROM 
    "Restaurants" 
  `;
  query.append(orderFormat(order));
  const data = await queryRows(query);
  return {
    total: data.length,
    data,
  };
};

module.exports = all;
