'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const handSensorProcessor = require('./handSensorProcessor');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/action', (req, res) => {
  io.emit('add action', handSensorProcessor(req.query));
  res.sendStatus(200);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => console.log('listening on *:3000'));