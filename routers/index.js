const Router = require("express");
const router = new Router();
const userRouter = require("./user/user_router");

router.use("/u", userRouter);

module.exports = router;