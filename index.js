const koa = require('koa');
const server = new koa();

// Static
const static = require('koa-static');

// Router
const Router = require('koa-router');
const route = new Router();

// Routes
route.get('/', (ctx, next) => (ctx.body = 'Hello, world!')); // ctx === context, req and res objects are combined into ctx

// Middleware
server.use(route.routes());
server.use(static('./public'));

// Listener
server.listen(5175, 'localhost', () =>
  console.log('Server up! Listening on Port 5175!')
);
