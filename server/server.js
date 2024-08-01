// // server/server.js
// require('dotenv').config();
// const http = require('http');
// const server = http.createServer((req, res) => {
//   // Handle HTTP requests if needed
// });

// console.log('Origin:', process.env.NEXT_PUBLIC_BASE_URL);

// const { Server } = require('socket.io');
// const io = new Server(server, {
//   cors: {
//     origin: process.env.NEXT_PUBLIC_BASE_URL, // Replace with your client URL
//     methods: ['GET', 'POST']
//   }
// });

// const users = {};

// io.on('connection', (socket) => {
//   console.log(`A user connected with id: ${socket.id}`);
  
//   // När en användare ansluter, spara deras socket-id
//   socket.on('register', (userId) => {
//     users[userId] = socket.id;
//   });

//   // När ett meddelande skickas, skicka det till rätt mottagare
//   socket.on('chat message', (message) => {
//     const receiverSocketId = users[message.receiverUserId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('chat message', message);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//     // Ta bort användaren från listan när de kopplar ifrån
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId];
//         break;
//       }
//     }
//   });
// });

// server.listen(3001, () => {
//   console.log('WebSocket server listening on port 3001');
// });


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

const users = {};

io.on('connection', (socket) => {
  console.log(`A user connected with id: ${socket.id}`);
  
  // När en användare ansluter, spara deras socket-id
  socket.on('register', (userId) => {
    users[userId] = socket.id;
    console.log(`User registered with id: ${userId} and socket id: ${socket.id}`);
  });

  // När ett meddelande skickas, skicka det till rätt mottagare
  socket.on('chat message', (message) => {
    console.log(`Message received from user ${message.userId} to user ${message.recipientId}: ${message.content}`);
    const receiverSocketId = users[message.recipientId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('chat message', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Ta bort användaren från listan när de kopplar ifrån
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(3001, () => {
  console.log('WebSocket server listening on port 3001');
});