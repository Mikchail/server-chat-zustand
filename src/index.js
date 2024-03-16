const express = require('express');
const app = express();
const cors = require("cors");
const {initialRoles} = require("./initialTables");
const port = process.env.PORT || 3000;
const router = require('./routers');
const multer = require('multer');
const upload = multer();
var corsOptions = {
  origin: "http://localhost:5173"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(upload.array());
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: false, limit: 10000 }));
// Настройки подключения к базе данных
app.use("/api", router);

const db = require("./models");
db.sequelize.sync()

// для пересоздание базы
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
//   initialRoles(db.models.Role)
// });
// const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
//   host: 'localhost',
//   dialect: 'postgres' // или 'mysql', 'sqlite', 'mariadb' и т.д.
// });

// Тестирование подключения к базе данных
// sequelize.authenticate()
//   .then(() => {
//     console.log('Подключение к базе данных установлено');
//   })
//   .catch(err => {
//     console.error('Ошибка подключения к базе данных:', err);
//   });

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});