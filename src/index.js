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

io.on('connection', (socket) => {
  socket.emit('welcomeMessage', 'Welcome to the chat room.');
  socket.on('toServerMessage', (message) => io.emit('chatboxMessage', message));
});

server.listen(port, () => console.log(`Chat app listening on port ${port}`));
