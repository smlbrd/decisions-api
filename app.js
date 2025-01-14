const connectDB = require('./database/database');
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');
const userController = require('./controllers/users.controller');
const listController = require('./controllers/lists.controller');
const groupController = require('./controllers/groups.controller');
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

route.get('/users/:userId', userController.getUserById);
route.put('/users/:userId', userController.updateUserById);
route.get('/users/:userId/saved_lists', userController.getListsByUserId);
route.get('/lists/:listId', listController.getListByListId);
route.get('/groups/:groupId', groupController.getGroupById);
route.get('/groups/:groupId/members', groupController.getMembersByGroupId);
route.post('/groups', groupController.postGroup);
route.post('/lists', listController.postList);
route.put("/groups/:groupId", groupController.editGroupById)
route.put('/users/:userId', userController.updateUserById);


module.exports = app;
