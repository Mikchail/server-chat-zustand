const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = {}
db.models.User = require("./User.js")(sequelize, Sequelize);
db.models.Role = require("./Role.js")(sequelize, Sequelize);
db.models.Room = require("./Room.js")(sequelize, Sequelize);
db.models.Message = require("./Message.js")(sequelize, Sequelize);
db.models.Token = require("./Token.js")(sequelize, Sequelize);
db.models.RoomUser = require("./RoomUser.js")(sequelize, Sequelize);


db.models.User.associate(db.models)
db.models.Room.associate(db.models)
db.models.RoomUser.associate(db.models)
db.models.Message.associate(db.models)
db.models.Token.associate(db.models)

// console.log(db.models.Room.associations);
// db.models.RoomUser = db.models.Room.associations.users.through.model


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

