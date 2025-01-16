const connectDB = require('./database/database');
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');
const userController = require('./controllers/users.controller');
const listController = require('./controllers/lists.controller');
const groupController = require('./controllers/groups.controller');
const decisionController = require("./controllers/decisions.controller")
const apiController = require('./controllers/api.controller');

const route = new Router();
const bodyParser = require('koa-bodyparser');

connectDB();

app.use(bodyParser());
app.use(route.routes());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof TypeError) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid request' };
    } else {
      ctx.status = err.status || 500;
      ctx.body = { error: err.message };
    }
  }
});

route.get('/', (ctx) => {
  ctx.status = 200;
  ctx.message = 'OK';
  ctx.body = 'Server online!';
});

route.get('/api', apiController.getEndpoints);
route.get('/users/:userId', userController.getUserById);
route.put('/users/:userId', userController.updateUserById);
route.get('/users/:userId/saved_lists', userController.getListsByUserId);
route.post("/users", userController.postNewUser)
route.delete('/users/:userId', userController.deleteUser);

route.get('/groups/:groupId', groupController.getGroupById);
route.put('/groups/:groupId', groupController.editGroupById);
route.get('/groups/:groupId/members', groupController.getMembersByGroupId);
route.post('/groups', groupController.postGroup);
route.delete('/groups/:groupId', groupController.deleteGroupById);

route.post('/decisions', decisionController.postDecision);

route.get('/lists/:listId', listController.getListByListId);
route.put('/lists/:listId', listController.updateListById);
route.post('/lists', listController.postList);
route.delete('/lists/:listId', listController.deleteListById);
route.post('/lists/:listId/options', listController.addItemToList);
route.delete(
  '/lists/:listId/options/:optionId',
  listController.deleteOptionById
);

module.exports = app;
