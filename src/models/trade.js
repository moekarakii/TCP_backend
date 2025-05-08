module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define('Trade', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    offeringUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receivingUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offeredCardId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedCardId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'cancelled'),
      defaultValue: 'pending',
    }
  }, {
    tableName: 'Trades',
    timestamps: true,
  });

  return Trade;
};