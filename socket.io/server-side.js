import koa from 'koa';
import { createServer } from 'http';
import { Server } from 'socket.io';
// set up the adapter on the primary thread
const app = koa();
const server = createServer(app);
const io = new Server(server, {
  //connectionStateRecovery: {},
  // **set up the adapter on each worker thread**
  //adapter: createAdapter(),
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
