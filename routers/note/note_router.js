const Router = require("express");
const router = new Router();
const userController = require("../controllers/user_controllers");
const authMiddleware = require("../middleware/auth_middleware");

module.exports = router;
