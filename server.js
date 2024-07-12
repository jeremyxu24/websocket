// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = [];

server.on('connection', (socket) => {
  console.log(`Client # ${clients.length + 1} connected `);
  clients.push(socket);

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});
