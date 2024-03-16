const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Room = sequelize.define(
    "Room",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "rooms", // имя таблицы в базе данных
    }
  );

  // Связь "многие ко многим" между Room и User
  Room.associate = (models) => {
    Room.belongsToMany(models.User, {
        through: models.RoomUser,
        foreignKey: 'roomId',
        otherKey: 'userId',
        as: 'users'
    });
    // Room.belongsToMany(models.User, { through: models.RoomUser });
    Room.hasMany(models.RoomUser, {
      foreignKey: "roomId",
    });
    // Связь "один ко многим" между Room и Message
    Room.hasMany(models.Message, {
      foreignKey: "roomId",
      as: "messages",
    });
  };

  return Room;
};
