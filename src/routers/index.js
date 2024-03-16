const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const RoomController = require("../controllers/room.controller");
const MessageController = require("../controllers/message.controller");
const authMiddleware = require("../middlewares/auth")
const { body } = require("express-validator");
// const { verifySignUp } = require("../middleware");
// const controller = require("../controllers/auth.controller");
router.post("/register", body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }), UserController.registeration)
router.post("/auth", body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }), UserController.login)
router.post("/users", authMiddleware, UserController.getUser)
router.get("/user/me", authMiddleware, UserController.getUserMe)
router.get("/users", authMiddleware, UserController.getUsers)

router.post("/room", authMiddleware, RoomController.createRoom) 
router.post("/rooms", authMiddleware, RoomController.getRooms)
router.post("/room/:roomId", authMiddleware, RoomController.getRoom)
router.delete("/room", authMiddleware, RoomController.removeUserFromRoom)
router.post("/joinroom", authMiddleware, RoomController.joinRoom)

router.post("/message/:roomId", authMiddleware, MessageController.createMessage)
router.get("/message/:roomId", authMiddleware, MessageController.getMessages)

module.exports = router;
// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "x-access-token, Origin, Content-Type, Accept"
//     );
//     next();
//   });

//   app.post(
//     "/api/auth/signup",
//     [
//       verifySignUp.checkDuplicateUsernameOrEmail,
//       verifySignUp.checkRolesExisted
//     ],
//     controller.signup
//   );

//   app.post("/api/auth/signin", controller.signin);
// };