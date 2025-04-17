module.exports = {
    DB: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  };
  