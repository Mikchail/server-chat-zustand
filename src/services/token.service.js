const jwt = require("jsonwebtoken");
const TokenModel = require("../models").models.Token;
const JWT_ACCESS_SECRET = "JWT_ACCESS_SECRET"
const JWT_REFRESH_SECRET = "JWT_REFRESH_SECRET"
class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "60m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenDate = await TokenModel.findOne({
      where: { userId },
    });
    if (tokenDate) {
      tokenDate.refreshToken = refreshToken
      return tokenDate.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken })
    return token;
  }

  async validateAccessToken(token) {
    try {
      const userDate = jwt.verify(token, JWT_ACCESS_SECRET)
      return userDate;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token) {
    try {
      const userDate = jwt.verify(token, JWT_REFRESH_SECRET)
      return userDate;
    } catch (error) {
      return null;
    }
  }
}


module.exports = new TokenService();