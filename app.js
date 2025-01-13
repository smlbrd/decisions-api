const Koa = require("Koa")
const bodyParser = require("koa-bodyparser")
const router = require("./router")
const connectDb = require("./connection")

const app = new Koa()


connectDb() // Change once cloud DB up and running

app.use(bodyParser())

app.use(router.routes().use(router.allowedMethods()))

//listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});