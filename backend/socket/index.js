const { Server } = require('socket.io');
 
let io;
 
const init = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });
 
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
 
    // Client joins a challenge room to receive leaderboard updates
    socket.on('join-challenge', (challengeId) => {
      socket.join(challengeId);
      console.log(`Socket ${socket.id} joined room ${challengeId}`);
    });
 
    socket.on('leave-challenge', (challengeId) => {
      socket.leave(challengeId);
    });
 
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
 
  return io;
};
 
const getIO = () => {
  if (!io) throw new Error('Socket.io not initialised');
  return io;
};
 
module.exports = { init, getIO };
