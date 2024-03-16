const MessageModel = require("../models").models.Message;
const RoomModel = require("../models").models.Room;
const UserModel = require("../models").models.User;
const RoomUser = require("../models").models.RoomUser;
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
            // not work
          include: {
            model: UserModel,
            as: "user",
          },
        }
      )
    ).toJSON();
    console.log({ message });
    return message;
  }

  async getMessages(userId, roomId) {
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
      const messages = await MessageModel.findAll({
        where: {
          roomId: roomId,
        },
        include: {
          model: UserModel,
          as: "user",
        },
      });
      return messages.map((message) => {
        const parsed = message.toJSON();
        return {
          ...parsed,
          user: new UserDto(parsed.user),
        };
      });
    }

    throw ApiError.BadRequest("У вас нет доступа к этой комнате");
  }
}

module.exports = new MessageService();
