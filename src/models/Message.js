const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages' // имя таблицы в базе данных
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Room, {
      foreignKey: 'roomId',
      as: 'room'
    });
  };
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return Message;
};