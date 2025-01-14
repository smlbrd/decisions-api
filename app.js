const connectDB = require("./database/database");
const koa = require("koa");
const app = new koa();
const Router = require("koa-router");
const userController = require("./controllers/users.controller");
const listController = require("./controllers/lists.controller");
const groupController = require("./controllers/groups.controller");
const route = new Router();
const bodyParser = require("koa-bodyparser");

connectDB();

app.use(bodyParser());
app.use(route.routes());

route.get("/", (ctx) => {
  ctx.status = 200;
  ctx.message = "OK";
  ctx.body = "Server online!";
});
route.get("/users", userController.getUsers);
route.get("/users/:userId", userController.getUserById);
route.get("/lists/:listId", listController.getListByListId);
route.get("/groups/:groupId", groupController.getGroupById);
route.post("/groups", groupController.postGroup);
route.post("/lists", listController.postList);

module.exports = app;
