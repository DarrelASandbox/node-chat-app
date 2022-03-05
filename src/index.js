// Websockets allow for full-duplex communication.
// Websockets is a separate protocol from HTTP.
// Persistent connection between client and server.

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocation } = require('./components/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./components/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('toClientMessage', generateMessage('Welcome to the chat!'));
    socket.broadcast
      .to(user.room)
      .emit(
        'toClientMessage',
        generateMessage(`${user.displayname} has joined the chat room.`)
      );

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('toServerMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message))
      return socket.emit(
        'toClientMessage',
        generateMessage('Profanity is not allowed!')
      );

    io.to(getUser(socket.id).room).emit(
      'toClientMessage',
      generateMessage(getUser(socket.id).displayname, message)
    );
    callback('Server has received the message.');
  });

  socket.on('locationMessage', (googleMapInfo, callback) => {
    io.to(getUser(socket.id).room).emit(
      'locationMessage',
      generateLocation(getUser(socket.id).displayname, googleMapInfo)
    );
    callback('Server has received the location.');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'toClientMessage',
        generateMessage(`${user.displayname} has left the chat room.`)
      );

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => console.log(`Chat app listening on port ${port}`));
