// Websockets allow for full-duplex communication.
// Websockets is a separate protocol from HTTP.
// Persistent connection between client and server.

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../public')));

let count = 0;

io.on('connection', (socket) => {
  socket.emit('countUpdated', count);

  socket.on('increment', () => {
    count++;
    // socket.emit('countUpdated', count);    Single client
    io.emit('countUpdated', count); // All clients
  });

  socket.on('reset', () => {
    count = 0;
    socket.emit('countUpdated', count);
  });
});

server.listen(port, () => {
  console.log(`Chat app listening on port ${port}`);
});
