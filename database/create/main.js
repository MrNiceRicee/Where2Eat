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

const readFile = async (file) => {
  const fileString = fs
    .readFileSync(path.join(__dirname, file), 'utf-8')
    .toString();
    await pool.query(fileString)
};

const sync = async () => {
  try {
    readFile('../sql/Tables.sql');
    readFile('../sql/Triggers.sql');
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
