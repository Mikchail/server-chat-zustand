const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const ApiError = require("../exeptions/ApiError");
const UserDto = require("../dtos/user.dto");
const tokenService = require("../services/token.service");
class UsersController {
  async login(req, res, next) {
    try {
      console.log("req", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest("не коректные данные"), errors.array());
      }

      const { email, password } = req.body;
      const user = await userService.login(email, password);
      //   res.cookie("refreshToken", user.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async registeration(req, res, next) {
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest("не коректные данные"), errors.array());
      }
      const { email, password } = req.body;
      const user = await userService.registeration(email, password);
      //   res.cookie("refreshToken", user.refreshToken, { maxAge: 10 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json({ user });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if(!refreshToken){
        return res.json({error: "not refreshToken"});
      }
      const accessToken = await tokenService.refresh(refreshToken);
      return res.json({accessToken});
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await userService.getUser(userId);
      return res.json(new UserDto(user));
    } catch (err) {
      next(err);
    }
  }

  async getUserMe(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await userService.getUser(userId);
      return res.json(new UserDto(user));
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const currentUserId = req.user.id;
      const users = await userService.getUsers({ ...req.query, currentUserId });
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UsersController();
