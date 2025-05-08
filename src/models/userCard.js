module.exports = (sequelize, DataTypes) => {
  const UserCard = sequelize.define('UserCard', {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'userId', // ✅ important: maps Sequelize to exact DB column
      references: {
        model: 'Users',
        key: 'uid'
      }
    },
    cardId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: 'cardId', // ✅ maps to DB column
      references: {
        model: 'Cards',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    }
  }, {
    tableName: 'userCards',
    timestamps: true
  });

  return UserCard;
};