const SQL = require('sql-template-strings');
const { queryRows } = require('../helpers');

const all = async () => {
  const query = SQL`SELECT * FROM "Users"`;
  const data = await queryRows(query);
  return {
    total: data.length,
    data,
  };
};

module.exports = all;
