const { environment } = require('../../environments/environment');
const { Sequelize } = require('sequelize');

const {
  database,
  username,
  password,
  host,
  port,
} = environment.mysql;


const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host,
    port,
    dialect: 'mysql',
  },
);

module.exports = sequelize;
