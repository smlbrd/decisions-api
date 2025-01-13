const connectDB = require("./database/database");
const koa = require("koa");
const server = new koa();
const static = require("koa-static");
const Router = require("koa-router");
const userController = require("./controllers/user.controller");
const listController = require("./controllers/lists.controller");
const groupController = require('./controllers/groups.controller');
const route = new Router();
const bodyParser = require("koa-bodyparser")

connectDB();
server.use(bodyParser()) 
server.use(route.routes());
server.use(static("./public"));


route.get("/", (ctx) => {
  ctx.status = 200;
  ctx.message = "OK";
  ctx.body = "Server online!";
});
route.get("/users", userController.getUsers);
route.get("/users/:userId", userController.getUserById);
route.get("/lists/:listId", listController.getListByListId);
route.get('/groups/:groupId', groupController.getGroupById);
route.post('/groups', groupController.postGroup)

server.listen(5175, "localhost", () =>
  console.log("Server up! Listening on Port 5175!")
);
