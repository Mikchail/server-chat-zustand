const bcrypt = require("bcrypt");
const UserModel = require("../models/index").models.User;
const UserDto = require("../dtos/user.dto");
const tokenService = require("./token.service");
const ApiError = require("../exeptions/ApiError");
const { Op } = require("sequelize");

class UserService {
  async login(email, password) {
    const user = (
      await UserModel.findOne({
        where: { email },
      })
    )?.toJSON();
    if (!user) {
      throw ApiError.BadRequest("Такого пользователя нет в системе!");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const userDto = new UserDto(user);
      const tokens = tokenService.generateToken({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
        user: { ...userDto, ...tokens },
      };
    }
    throw ApiError.BadRequest("Неверный логин или пароль!");
  }

  async registeration(email, password) {
    if (!email || !password) {
      return { error: "нету данных" };
    }
    const oldUser = await UserModel.findOne({
      where: { email },
    });
    if (oldUser) {
      throw ApiError.BadRequest("Пользователь с таким емейлом уже существует!");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = (await UserModel.create({ email, password: hash })).toJSON();
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...userDto, ...tokens };
  }

  async getUser(userId) {
    const user = await UserModel.findByPk(userId);
    return user;
  }

  async getUsers({ limit, offset, loadedUserIds, currentUserId }) {
    const loadedU = loadedUserIds?.length ? JSON.parse(loadedUserIds) : [];
    console.log(loadedU);
    const users = await UserModel.findAndCountAll({
      where: {

        id: {
          [Op.notIn]: [currentUserId]
        }
      },
      // not correct work
      // where: {
      //   id: {
      //     [Op.notIn]: loadedU // исключить пользователей с указанными идентификаторами
      //   }
      // },
      limit: limit,
      offset: offset,
    });
    console.log({ users });
    return {
      items: users.rows.map((user) => new UserDto(user)),
      total: users.count,
    };
  }
}

module.exports = new UserService();
