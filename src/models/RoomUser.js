const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RoomUser = sequelize.define(
    "RoomUser",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    //   userId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //   },
    //   roomId: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //   },
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
      tableName: "room_users", // имя таблицы в базе данных
    }
  );

  // Связь "многие ко многим" между Room и User
  RoomUser.associate = (models) => {
    RoomUser.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    // Связь "один ко многим" между Room и Message
    RoomUser.belongsTo(models.Room , {
      foreignKey: "roomId",
      as: "room",
    });
  };

  return RoomUser;
};
