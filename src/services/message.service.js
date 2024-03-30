const MessageModel = require("../models").models.Message;
const RoomModel = require("../models").models.Room;
const UserModel = require("../models").models.User;
const RoomUser = require("../models").models.RoomUser;
const { Op } = require("sequelize");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exeptions/ApiError");

class MessageService {
  async createMessage(text, userId, roomId) {
    if (!text || !userId || !roomId) {
      return { error: "нету данных" };
    }
    const message = (
      await MessageModel.create(
        { text, userId, roomId },
        {
          include: {
            model: UserModel,
            as: "user",
          },
        }
      )
    ).toJSON();
    return message;
  }

  async getMessages({ limit, offset, loadedMessageIds, userId, roomId }) {
    console.log("loadedMessageIds", loadedMessageIds);
    if (!userId || !roomId) {
      return { error: "нету данных" };
    }
    const roomUsers = await RoomUser.findOne({
      where: {
        roomId: roomId,
        userId: userId,
      },
    });
    if (roomUsers) {
      //   const loadedU = loadedMessageIds?.length
      //     ? JSON.parse(loadedMessageIds)
      //     : null;
      const messages = await MessageModel.findAndCountAll({
        where: {
          roomId: roomId,
          //   id: {
          //     [Op.notIn]: loadedU,
          //   }
        },
        include: {
          model: UserModel,
          as: "user",
        },

        limit: limit,
        offset: offset,
        order: [["createdAt", "DESC"]],
      });

      return {
        items: messages.rows.map((message) => {
          const parsed = message.toJSON();
          return {
            ...parsed,
            user: new UserDto(parsed.user),
          };
        }),
        total: messages.count,
      };
    }

    throw ApiError.BadRequest("У вас нет доступа к этой комнате");
  }
}

module.exports = new MessageService();
