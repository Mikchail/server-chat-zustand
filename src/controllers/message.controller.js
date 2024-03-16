const messageService = require("../services/message.service");

class MessageController {

  async createMessage(req, res, next) {
    try {
      const { text } = req.body;
      const { roomId } = req.params;
      const userId = req.user.id
      console.log({roomId, text, userId});
      const message = await messageService.createMessage(text, userId, roomId)
      return res.json(message);
    } catch (err) {
      next(err);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { roomId } = req.params;
      const userId = req.user.id
      const messages = await messageService.getMessages(userId, roomId)
      console.log({messages});
      return res.json(messages);
    } catch (err) {
      console.log("err", err);
      next(err);
    }
  }

  async deleteMessage(req, res, next) {
    const { MessageId } = req.body;
    try {
      return res.json("deleteMessage");
    } catch (err) {
      next(err);
    }
  }



}
module.exports = new MessageController();