const Router = require('koa-router');
const controller = require('./controller');
const User = require('./model');

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'workled';
});

router.get('/users', controller.getUserByName);

module.exports = router;
