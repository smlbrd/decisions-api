const http = require('http');
const socketIO = require('socket.io');

const ioConnection = (app) => {
  const server = http.createServer(app.callback());
  const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:8081',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('hi', (msg) => {
      console.log('hi');
    });
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });
  
  return server;
};

module.exports = ioConnection;
