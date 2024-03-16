const RoomModel = require("../models").models.Room;
const UserModel = require("../models").models.User;
const RoomUser = require("../models").models.RoomUser;
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const findRoomWithUsers = (userId) => {
  return RoomModel.findOne({
    include: [
      {
        model: UserModel,
        as: "users",
      },
    ],
    where: {
      id: {
        [Op.in]: Sequelize.literal(
          `(SELECT "room_users"."roomId" FROM room_users WHERE "room_users"."userId" = ${userId})`
        ),
      },
    },
  });
};

const addRoomForUser = async (userId, currentUserId, room) => {
  const user = await UserModel.findByPk(userId);
  const currentUser = await UserModel.findByPk(currentUserId);
  await user.addRoom(room.id); // сохранение связи между пользователем и комнатой
  await currentUser.addRoom(room.id); // сохранение связи между пользователем и комнатой
};
class RoomService {
  async createRoom(name, currentUserId, userId) {
    if (!name || !userId) {
      return { error: "нету данных" };
    }

    try {
      const room = await findRoomWithUsers(userId);
      if (room) {
        // GOVNO KOD
        const parsedroom = room.toJSON();
        await addRoomForUser(userId, currentUserId, parsedroom)
        return parsedroom
      } else {
        const newRoom = await RoomModel.create({ name });
        const parsedNewRoom = newRoom.toJSON();
        await addRoomForUser(userId, currentUserId, parsedNewRoom)
        const room = await findRoomWithUsers(userId);
        const parsedroom = room.toJSON();
        return parsedroom
      }
    } catch (error) {
      console.log(error);
    }
  }

  async joinRoom(roomId, userId) {
    if (!roomId || !userId) {
      return { error: "нету данных" };
    }
    // const room = (await RoomModel.create({ name, userId })).toJSON();

    const room = await RoomModel.findByPk(roomId);
    if (room) {
      const user = await UserModel.findByPk(userId);

      if (user) {
        const r = await room.addUser(user.id);
        console.log({ r });
        await user.addRoom(room.id); // сохранение связи между пользователем и комнатой
      }
    }
    return {};
  }

  async getRoom(roomId) {
    if (!roomId) {
      return { error: "нету данных" };
    }
    try {
      const room = await RoomModel.findByPk(roomId, {
        include: [
          {
            model: UserModel,
            as: "users",
          },
        ],
      });
      return room;
    } catch (error) {
      console.log(error);
    }
  }

  async getRooms(userId) {
    if (!userId) {
      return { error: "нету данных" };
    }
    try {
      //   const user = await UserModel.findByPk(userId, {
      //     include: {
      //       model: RoomModel,
      //       as:
      //       // include:{ model: RoomUser }
      //       // include:  RoomModel
      //     } /* , include: [{ model: RoomUser, as: "room_users" }] */,
      //   });
      const rooms = await RoomModel.findAll({
        include: [
          {
            model: UserModel,
            as: "users",
          },
        ],
        where: {
          id: {
            [Op.in]: Sequelize.literal(
              `(SELECT "room_users"."roomId" FROM room_users WHERE "room_users"."userId" = ${userId})`
            ),
          },
        },
      });

      //   const roomsWithUserLists = rooms.map((room) => ({
      //     ...room.toJSON(),
      //     users: room.users.map((user) => user.toJSON()), // преобразование объектов User в JSON и извлечение списка пользователей
      //   }));
      //   console.log(roomsWithUserLists);
      console.log("----------rooms----------------");
      // const rooms = (await RoomModel.findAll({ include: { all: true }, where: userId }));
      return {
        rooms: rooms.map((r) => r.toJSON()),
        /* rooms: user.rooms.map((room) => room.toJSON()) */
      };
    } catch (error) {
      console.log({ error });
      return { rooms: [] };
    }
  }

  async removeUserFromRoom(roomId, userId) {
    const room = await RoomModel.findByPk(roomId);
    const user = await UserModel.findByPk(userId);

    await room.removeUser(user); // удаление связи между пользователем и комнатой
    console.log("Связь между пользователем и комнатой удалена");
    return { rooms: "deelre" };
  }
}

module.exports = new RoomService();
