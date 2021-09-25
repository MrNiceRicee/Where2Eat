const express = require('express');
const middleware = require('./middleware');

const app = express();

middleware(app);

const startServer = (port) => {
  app.listen(port, () => {
    console.log(`server listening on ${port}`);
  });
};

module.exports = {
  app,
  startServer,
};
