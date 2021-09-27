const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'password',
  database: 'where2eat',
  port: 5432,
  host: 'localhost',
});

const sync = async () => {
  try {
    await pool.query(`
      DROP SCHEMA IF EXISTS public CASCADE;
      CREATE SCHEMA public;
    `)
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
