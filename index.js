var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let express = require('express');

let playerActions = 0;

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
    
    //When the server receives the emitted "Player Action" from the client, do this
    socket.on('Player Action', function(msg){
      playerActions++; //Increase our recorded actions variable
      socket.broadcast.emit('sentAction'); //Send sentAction back to client
  
      if(playerActions == 2)
      {
        startGame();
        users = {};
        playerActions = 0;
      }
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


