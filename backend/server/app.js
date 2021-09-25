const { app, startServer } = require('./helpers');
const routes = require('./routes');

routes(app);

startServer(8000);

module.exports = app;