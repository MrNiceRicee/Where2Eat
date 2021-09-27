const { Pool } = require('pg');

const currentENV = process.env.RUN_ENV;

const pool = new Pool({
  user: 'postgres',
  password: 'password',
  database: currentENV === 'test' ? 'where2eat_test' : 'where2eat',
});

/**
 * SQL statement expecting only one result
 * @param {String} text - SQL statement
 * @param {String[]} params - parameters for SQL statement
 * @returns one result
 */
const queryOne = async (text, params) => {
  const result = await pool.query(text, params);
  return result?.rows?.[0];
};

/**
 * SQL statement expecting multiple results
 * @param {String} text - SQL statement
 * @param {String[]} params - parameters for SQL statement
 * @returns array of results
 */
const queryRows = async (text, params) => {
  const result = await pool.query(text, params);
  return result?.rows;
};

/**
 * SQL statement based on pg query
 * @param {String} text - SQL statement
 * @param {String[]} params - parameters for SQL statement
 * @returns pg SQL return statement
 */
const query = async (text, params) => {
  return await pool.query(text, params);
};

module.exports = {
  query,
  queryOne,
  queryRows,
};
