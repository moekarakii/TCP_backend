const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../../config/db.config');

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    retry: { max: 5 },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: console.log,
  }
);

// Load models
const User = require('./user')(sequelize, DataTypes);
const Card = require('./card')(sequelize, DataTypes);
const UserCard = require('./userCard')(sequelize, DataTypes);
const Trade = require('./trade')(sequelize, DataTypes);

// Associations
// Associations
User.belongsToMany(Card, {
  through: UserCard,
  foreignKey: 'userId',
  otherKey: 'cardId',
});
Card.belongsToMany(User, {
  through: UserCard,
  foreignKey: 'cardId',
  otherKey: 'userId',
});

User.hasMany(UserCard, {
  foreignKey: 'userId',
  sourceKey: 'uid',
});
UserCard.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'uid',
});

// in Trade model or index.js association setup
Trade.belongsTo(Card, { foreignKey: 'offeredCardId', as: 'offeredCard' });
Trade.belongsTo(Card, { foreignKey: 'requestedCardId', as: 'requestedCard' });
Trade.belongsTo(User, { foreignKey: 'offeringUserId', as: 'offeringUser' });

Card.hasMany(UserCard, { foreignKey: 'cardId' });
UserCard.belongsTo(Card, { foreignKey: 'cardId' });

// Attach to db object
const db = { sequelize, Sequelize, User, Card, UserCard, Trade };

module.exports = db;