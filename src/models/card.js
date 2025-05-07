module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rarity: {
      type: DataTypes.STRING,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'Cards',
    timestamps: true
  });

  Card.associate = models => {
    Card.belongsToMany(models.User, { through: models.UserCard });
  };

  return Card;
};