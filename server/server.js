// server/server.js
require('dotenv').config();
const http = require('http');
const server = http.createServer((req, res) => {
// Handle HTTP requests if needed
});

console.log('Origin:', process.env.NEXT_PUBLIC_BASE_URL);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_BASE_URL, // Replace with your client URL
    methods: ['GET', 'POST']
  }
});



io.on('connection', (socket) => {
  console.log(`A user connected with id: ${socket.id}`);
  
  // Handle chat messages
  socket.on('chat message', (message) => {
    io.emit('chat message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});