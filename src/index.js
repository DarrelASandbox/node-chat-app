// Websockets allow for full-duplex communication.
// Websockets is a separate protocol from HTTP.
// Persistent connection between client and server.

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.emit('toClientMessage', 'Welcome to the chat room.');
  socket.broadcast.emit(
    'toClientMessage',
    'A new user has joined the chat room.'
  );

  socket.on('toServerMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) return callback('Profanity is not allowed!');

    io.emit('toClientMessage', message);
    callback('Server has received the message.');
  });

  socket.on('disconnect', () =>
    io.emit('toClientMessage', 'A user has left the chat room.')
  );
});

server.listen(port, () => console.log(`Chat app listening on port ${port}`));
