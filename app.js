const Koa = require('koa');
const connectDB = require('./database/database');

const app = new Koa();

connectDB(); // Change once cloud DB up and running
