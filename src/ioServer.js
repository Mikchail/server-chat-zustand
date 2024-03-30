const { v4: uuidv4 } = require("uuid");
const messageService = require("./services/message.service");
module.exports = (server, app) => {
  // configuração do socket.io
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", function (socket) {
    console.log("Nova conexão estabelecida.");
    // получаем название комнаты из строки запроса "рукопожатия"
    const { roomId } = socket.handshake.query;
    // сохраняем название комнаты в соответствующем свойстве сокета
    socket.roomId = roomId;
    socket.join(roomId)
    socket.on("user:add", (user) => {
      //   const user = { id: uuidv4(), username: username, numUsers: 1 };
      socket.user = user;
      io.emit("login", user);
      console.log(`Usuário ${user.email} id: ${user.id} conectado`);
    });

    socket.on("message:new", (data) => {
      const message = { username: socket.user.username, message: data };
      if (app.isDev) {
        console.log(message);
      }
      io.emit("message:new", message);
    });

    socket.on("message:add", async (data) => {
      if (socket.user?.id) {
        console.log(
          "message:addmessage:addmessage:addmessage:add",
          data,
          socket.user.id,
          socket.roomId
        );
        const newMessage = await messageService.createMessage(
          data.message,
          socket.user.id,
          socket.roomId
        );
        // console.log(newMessage);
        // const message = { user: socket.user, message: newMessage };
        // console.log("message", message);
        io.in(socket.roomId).emit('message', newMessage)
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.user} desconectou-se.`);
    });
  });

  return io;
};
