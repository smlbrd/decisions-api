const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const router = require("./router")
const connectDb = require("./connection") 

const app = new Koa()

connectDb() // Change once cloud DB up and running

app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())

//listener
const PORT = 3000; //process.env.PORT || 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});