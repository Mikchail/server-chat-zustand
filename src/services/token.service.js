const jwt = require("jsonwebtoken");
const TokenModel = require("../models").models.Token;
const UserModel = require("../models").models.User;
const JWT_ACCESS_SECRET = "JWT_ACCESS_SECRET";
const JWT_REFRESH_SECRET = "JWT_REFRESH_SECRET";
const UserDto = require("../dtos/user.dto");

class TokenService {
  generateTokens(payload) {
    const accessToken = this.generateAccessToken(payload)
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(payload){
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: "10d",
    });
    return accessToken
  }

  async refresh(refreshToken) {
    console.log("refreshToken", refreshToken);
    const tokenDate = await TokenModel.findOne({
      where: { "refreshToken": refreshToken }
    });
    if(!tokenDate) {
      return { error: "Not found user for refresh" }
    }

    const decoded = jwt.decode(refreshToken);
    const userDto = new UserDto({email: decoded.email,id: decoded.id, name: decoded.name} )
    console.log({userDto});
    const accessToken = this.generateAccessToken({ ...userDto });
    return accessToken
  }

  async saveToken(userId, refreshToken) {
    console.log({userId});
    const tokenDate = await TokenModel.findOne({
      include: {
        model: UserModel,
        as: "user",
        where: { "id": userId }
      },
    });
    console.log({tokenDate});
    if (tokenDate) {
      tokenDate.refreshToken = refreshToken;
      return tokenDate.save();
    }
    const token = await TokenModel.create({ userId: userId, refreshToken });
    return token;
  }

  async validateAccessToken(token) {
    try {
      const userDate = jwt.verify(token, JWT_ACCESS_SECRET);
      return userDate;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token) {
    try {
      const userDate = jwt.verify(token, JWT_REFRESH_SECRET);
      return userDate;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
// SELECT "Token"."id", "Token"."refreshToken", "Token"."createdAt", "Token"."updatedAt", "Token"."userId", "user"."id" AS "user.id", "user"."name" AS "user.name", "user"."email" AS "user.email", "user"."password" AS "user.password", "user"."createdAt" AS "user.createdAt", "user"."updatedAt" AS "user.updatedAt" FROM "tokens" AS "Token" INNER JOIN "users" AS "user" ON "Token"."userId" = "user"."id" AND "user"."id" = 1 LIMIT 1;