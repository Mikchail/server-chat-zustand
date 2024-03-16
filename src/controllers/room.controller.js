const roomService = require("../services/room.service");

class RoomController {
  async createRoom(req, res, next) {
    try {
      const { name, userId } = req.body;
      const curentUserId = req.user.id;
      let roomName = name
      if(!name) {
        roomName = "private"
      }
      const room = await roomService.createRoom(roomName, curentUserId, userId);
      return res.json(room);
    } catch (err) {
      next(err);
    }
  }

  async getRooms(req, res, next) {
    console.log(req.query);
    try {
      const { userId } = req.body;
      const rooms = await roomService.getRooms(userId);
      return res.json(rooms);
    } catch (err) {
      next(err);
    }
  }

  async getRoom(req, res, next) {
    console.log(req.params);
    try {
      const rooms = await roomService.getRoom(req.params.roomId);
      return res.json(rooms);
    } catch (err) {
      next(err);
    }
  }

  async joinRoom(req, res, next) {
    console.log(req.query);
    try {
      const { userId, roomId } = req.body;
      const rooms = await roomService.joinRoom(roomId, userId);
      return res.json(rooms);
    } catch (err) {
      next(err);
    }
  }

  async deleteRoom(req, res, next) {
    const { RoomId } = req.body;
    try {
      return res.json("deleteRoom");
    } catch (err) {
      next(err);
    }
  }

  async removeUserFromRoom(req, res, next) {
    console.log(req.query);
    try {
      const { userId, roomId } = req.body;
      const rooms = await roomService.removeUserFromRoom(roomId, userId);
      return res.json({ rooms });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new RoomController();
