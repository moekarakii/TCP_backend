const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    retry: {
      max: 5 // ✅ try reconnecting up to 5 times if initial connection fails
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log, // Optional: helpful during dev, turn off later
  }
);

module.exports = { sequelize };
