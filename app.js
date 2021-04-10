// make bluebird default Promise
const dotenv = require('dotenv');

dotenv.config();
const { environment } = require('./environments/environment');
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const logger = require('./src/config/logger');
const app = require('./src/config/express');
const sequelize = require('./src/config/sequelize');

const { port } = environment.express;
const { env } = environment.express;

try {
  sequelize.authenticate();
  console.log('Sequelize Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;
