const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

/**
 * adds middleware to the express server
 * @param {Object} app - express server object
 */
const middleware = (app) => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: false, limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
};

module.exports = middleware;
