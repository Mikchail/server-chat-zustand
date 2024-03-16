const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    },
    {
      tableName: "users", // имя таблицы в базе данных
      toJSON: {
        virtuals: true,
        getters: true,
      },
    }
  );
  // Связь "многие ко многим" между User и Room
  User.associate = (models) => {
    User.belongsToMany(models.Room, {
      through: models.RoomUser,
      foreignKey: "userId",
      otherKey: "roomId",
      as: "rooms",
    });
    // User.belongsToMany(models.Room, { through: models.RoomUser });
    User.hasMany(models.RoomUser, {
      foreignKey: "userId",
    });
    User.belongsToMany(models.Role, {
      through: "user_roles",
    });
    User.hasMany(models.Token, {
      foreignKey: "userId",
      as: "tokens",
    });
    User.hasMany(models.Message, {
      foreignKey: "userId",
      as: "messages",
    });
  };

  return User;
};
