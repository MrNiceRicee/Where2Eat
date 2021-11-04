const SQL = require('sql-template-strings');
const { queryRows, ErrorException } = require('../../helpers');

const search = async ({ id, name, strict = false } = {}) => {
  // if both doesn't exist, throw error
  if (!id && !name) throw new ErrorException('Missing search requirements', 400);

  const query = SQL`SELECT * FROM "Users" `;
  const filter = SQL`WHERE 1=1`
  if (id) {
    filter.append(` AND "_id"=${id} `);
  }
  
  if (name) {
    if (strict) {
      filter.append(` AND "name" ILIKE '${name}'`);
    } else {
      filter.append(` AND "name" ILIKE '%${name}%'`);
    }
  }

  query.append(filter);
  const data = await queryRows(query);

  return {
    total: data.length,
    data,
  };
};

module.exports = search;
