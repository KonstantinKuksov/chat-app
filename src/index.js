const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const Filter = require('bad-words');

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New WebServer connection');

  socket.emit('message', 'Welcome to chat!');
  socket.broadcast.emit('message', 'A new user has joined!');

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', (location, callback) => {
    io.emit(
      'locationMessage',
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });
});

server.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
