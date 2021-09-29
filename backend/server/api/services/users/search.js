const SQL = require('sql-template-strings');
const { queryRows, ErrorException } = require('../helpers');

const search = async ({ id, name } = {}) => {

  if (!id && !name) throw new ErrorException('Missing search requirements', 500);

  const query = SQL`SELECT * FROM "Users" `;
  const filter = SQL`WHERE 1=1`
  if (id) {
    filter.append(` AND "_id"=${id}`);
  }
  if (name) {
    filter.append(` AND "name" ILIKE '%${name}%'`);
  }

  query.append(filter);
  const data = await queryRows(query);

  return {
    total: data.length,
    data,
  };
};

module.exports = search;
