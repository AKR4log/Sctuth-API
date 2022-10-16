const Router = require("express");
const router = new Router();
const userController = require("../controllers/user_controllers");
const authMiddleware = require("../middleware/auth_middleware");

router.post("/connect", userController.connect);
router.get("/auth-check", authMiddleware, userController.check);
router.post("/set-bio", authMiddleware, userController.set_bio);
router.post("/upd-name", authMiddleware, userController.upd_name);
// router.post("/subscribe", userController.subscribe);
// router.post("/get-subscribers", userController.getSubscribers);
// router.post("/get-subscriptions", userController.getSubscriptions);

module.exports = router;