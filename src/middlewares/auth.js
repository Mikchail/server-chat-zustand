const ApiError = require("../exeptions/ApiError");
const tokenService = require("../services/token.service");


module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.header('authorization');
    console.log("authorizationHeader", authorizationHeader);
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    console.log("accessToken", accessToken);
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userDate = await tokenService.validateAccessToken(accessToken);
    console.log("userDate", userDate);
    if (!userDate) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userDate
    next();
  } catch (error) {
    console.log(error)
    return next(ApiError.UnauthorizedError());
  }
}