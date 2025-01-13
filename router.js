const connectDB = require('./database/database');
const koa = require('koa');
const server = new koa();
const static = require('koa-static');
const Router = require('koa-router');
const controller = require('./controllers/user.controller');
const listController = require('./controllers/list.controller');

const route = new Router();

connectDB();

route.get('/', (ctx) => {
  ctx.status = 200;
  ctx.message = 'OK';
  ctx.body = 'Server online!';
});
route.get('/users', controller.getUsers);
route.get('/users/:userId', controller.getUserById);
route.get('/lists/:listId', listController.getListById);

// Middleware
server.use(route.routes());
server.use(static('./public'));

// Listener
server.listen(5175, 'localhost', () =>
  console.log('Server up! Listening on Port 5175!')
);
