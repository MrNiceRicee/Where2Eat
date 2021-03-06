const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { main } = require('../config');

const pool = new Pool(main);

const readFile = async (file) => {
  const fileString = fs
    .readFileSync(path.join(__dirname, file), 'utf-8')
    .toString();
    await pool.query(fileString)
};

const sync = async () => {
  try {
    readFile('../sql/Where2Eat.sql');
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
