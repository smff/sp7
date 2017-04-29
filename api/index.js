'use strict';

const express = require('express');
const app = express();
const handSensorProcessor = require('./handSensorProcessor');

// var http = require('http').Server(app);
// var io = require('socket.io')(http);

app.get('/', (req, res) => {
  let action = handSensorProcessor(req.query);
  res.send(action);
});


// io.on('connection', function(socket) {
//   console.log('a user connected');
//   socket.on('disconnect', function() {
//     console.log('user disconnected');
//   });
// });
//
// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//     console.log('message: ' + msg);
//   });
// });


// http.listen(3000, function() {
//   console.log('listening on *:3000');
// });

app.listen(3000, function() {
  console.log('listening on *:3000');
});