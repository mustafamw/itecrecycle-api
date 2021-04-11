const { environment } = require('../../environments/environment');
const { Sequelize } = require('sequelize');

const {
  database,
  username,
  password,
  host,
  port,
} = environment.mysql;


const sequelize = new Sequelize(`mysql://${username}:${password}@${host}:${port}/${database}`);

module.exports = sequelize;
