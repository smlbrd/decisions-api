const Router = require("koa-router")

const controller = require("./controller") 

const router = new Router

router.get("/users", controller.getUsers) 

module.exports = router