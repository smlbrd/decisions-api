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
    socket.on('decision', (decision_id) => {
      socket.join(decision_id);
    });
    socket.on('user', (user_id) => {
      console.log('user_id: ', user_id);
      socket.join(user_id);
    });
    socket.on('removeUser', (user_id) => {
      socket.leave(user_id);
    });
    // socket.on('logRooms', () => {
    //   console.log(`Socket ${socket.id} is in rooms:`, [...socket.rooms]);
    // });
    socket.on('refresh', ({ room, msg, decision_id }) => {
      const key = 'id' + Math.random().toString(16).slice(2);
      console.log(key);
      socket.broadcast.to(room).emit('refresh', msg, key, decision_id);
    });
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });

  return server;
};

module.exports = ioConnection;
