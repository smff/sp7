'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const fileType = require('file-type');

const imageGenerator = require('./imageGenerator');

const temperatureData = require('../hologlobe/temperature.json');
const pressureData = require('../hologlobe/pressure.json');

const handSensorProcessor = require('./handSensorProcessor');

app.use(express.static('../hologlobe'));

app.get('/action', (req, res) => {
  io.emit('yo', handSensorProcessor(req.query));
  res.sendStatus(200);
});

app.get('/temperature', (req, res) => {
  imageResponse(res, imageGenerator(temperatureData, 250, 320));
});

app.get('/pressure', (req, res) => {
  imageResponse(res, imageGenerator(pressureData, 101000, 102000));
});


io.on('connection', function(socket) {
  socket.on('rotate_more', function(msg) {
    socket.broadcast.emit('rotate_more', msg);
  });
  socket.on('rotate_less', function(msg) {
    socket.broadcast.emit('rotate_less', msg);
  });
  socket.on('rotate_up', function(msg) {
    socket.broadcast.emit('rotate_up', msg);
  });
  socket.on('rotate_down', function(msg) {
    socket.broadcast.emit('rotate_down', msg);
  });
  socket.on('switch_heatmap', function(msg) {
    socket.broadcast.emit('switch_heatmap', msg);
  });
  socket.on('stop_rotation', function(msg) {
    socket.broadcast.emit('stop_rotation', msg);
  });
  socket.on('glitch_it', function(msg) {
    socket.broadcast.emit('glitch_it', msg);
  });
});


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => console.log('user disconnected'));
});


function imageResponse(res, data) {
  let mimeType = fileType(data);
  if (mimeType !== null) {
    res.setHeader('content-type', mimeType.mime);
  }
  res.status(200).send(new Buffer(data, 'binary'));
}


http.listen(3000, () => console.log('listening on *:3000'));