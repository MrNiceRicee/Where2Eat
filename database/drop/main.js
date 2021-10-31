const { Pool } = require('pg');
const { main } = require('../config');

const pool = new Pool(main);

const sync = async () => {
  try {
    await pool.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
    `);
  } catch (err) {
    console.log('error', err);
    console.log('err', err.message);
    throw err;
  } finally {
    // kill the connection no matter what
    pool.end();
  }
};

sync();
