module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });

    Role.associate = (models) => {
        Message.belongsTo(models.User, {
            through: 'user_roles'
        });
      };
    
    //   User.belongsToMany(models.Room, {
    //     through: 'RoomUsers',
  // db.role.belongsToMany(db.user, {
//     through: "user_roles"
// });
// db.user.belongsToMany(db.role, {
//     through: "user_roles"
// });
    return Role;
  };