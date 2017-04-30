'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const handSensorProcessor = require('./handSensorProcessor');

app.use(express.static('../hologlobe'));

app.get('/action', (req, res) => {
  io.emit('yo', handSensorProcessor(req.query));
  res.sendStatus(200);
});


io.on('connection', function(socket){
  socket.on('rotate_more', function(msg){
    socket.broadcast.emit('rotate_more', msg);
  });
  socket.on('rotate_less', function(msg){
    socket.broadcast.emit('rotate_less', msg);
  });
  socket.on('rotate_up', function(msg){
    socket.broadcast.emit('rotate_up', msg);
  });
  socket.on('rotate_down', function(msg){
    socket.broadcast.emit('rotate_down', msg);
  });
  socket.on('switch_heatmap', function(msg){
    socket.broadcast.emit('switch_heatmap', msg);
  });
  socket.on('stop_rotation', function(msg){
    socket.broadcast.emit('stop_rotation', msg);
  });
});



io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => console.log('user disconnected'));
});

http.listen(3000, () => console.log('listening on *:3000'));