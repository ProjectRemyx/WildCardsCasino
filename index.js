var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let express = require('express');

//Static files served in static folder
app.use('/static', express.static('static'))

//Open index when serving node index.js
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
}); 

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('Player Action', function(msg){
      console.log(msg);
      io.emit('Player Action', msg);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


