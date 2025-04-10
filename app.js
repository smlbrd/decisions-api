const connectDB = require('./database/database');
const cors = require('@koa/cors');
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');
const userController = require('./controllers/users.controller');
const listController = require('./controllers/lists.controller');
const groupController = require('./controllers/groups.controller');
const decisionController = require('./controllers/decisions.controller');
const apiController = require('./controllers/api.controller');

const route = new Router();
const bodyParser = require('koa-bodyparser');
const ioConnection = require('./socket.io/io');

connectDB();

const server = ioConnection(app);

app.use(cors());
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
route.post('/users', userController.postNewUser);
route.delete('/users/:userId', userController.deleteUser);
route.get('/users', userController.getUsers);

route.get('/groups/:groupId', groupController.getGroupById);
route.put('/groups/:groupId', groupController.editGroupById);
route.get('/groups/:groupId/members', groupController.getMembersByGroupId);
route.post('/groups', groupController.postGroup);
route.delete('/groups/:groupId', groupController.deleteGroupById);
route.delete(
  '/groups/:groupId/users/:userId',
  groupController.removeUserByIdFromGroupById
);
route.get('/users/:user_id/groups', groupController.getGroupsByUserId);

route.post('/decisions', decisionController.postDecision);
route.get('/decisions/:decisionId', decisionController.getDecisionById);
route.get(
  '/groups/:groupId/decisions',
  decisionController.getDecisionByGroupId
);
route.get('/users/:userId/decisions', decisionController.getDecisionByUserId);
route.put('/decisions/:decisionId', decisionController.updateDecisionById);
route.delete('/decisions/:decisionId', decisionController.deleteDecisionById);

route.get('/lists/:listId', listController.getListByListId);
route.put('/lists/:listId', listController.updateListById);
route.post('/lists', listController.postList);
route.delete('/lists/:listId', listController.deleteListById);
route.post('/lists/:listId/options', listController.addItemToList);
route.delete(
  '/lists/:listId/options/:optionId',
  listController.deleteOptionById
);
route.put('/lists/:listId/options/:optionId', listController.updateOptionById);

module.exports = server;
