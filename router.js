const Router = require("koa-router");
const controller = require("./controller");

const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "workled";
});

const User = require("./model");
router.get("/users", async (ctx) => {
    const users = await User.find()
    ctx.body = users;
  });

module.exports = router;
