const Router = require("express");
const router = new Router();
const userController = require("../controllers/user_controllers");
const authMiddleware = require("../middleware/auth_middleware");

router.post("/connect", userController.connect);
router.post("/set-bio", authMiddleware, userController.set_bio);
router.post("/update-phone", authMiddleware, userController.upd_phone);
router.post("/update-name", authMiddleware, userController.upd_name);
router.post("/update-username", authMiddleware, userController.upd_username);
router.post("/code-confirmation", authMiddleware, userController.confirmation);
router.post("/set-cover", authMiddleware, userController.set_cover);
router.post("/set-back-cover", authMiddleware, userController.set_back_cover);
router.get("/auth-check", authMiddleware, userController.check);
router.get("/get-bio", authMiddleware, userController.get_bio);
router.get("/get-info-user", authMiddleware, userController.get_info_user);
router.get("/get-cover", authMiddleware, userController.get_cover);
router.get("/get-back-cover", authMiddleware, userController.get_back_cover);

module.exports = router;
