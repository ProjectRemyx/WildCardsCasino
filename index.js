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

//Start io
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

    /* Get random number 1 or 2 */
    function getRandomNumber() 
    {
      return Math.floor(Math.random() * (2 - 1 + 1)) + 1
    }

    function startGame(){
      //Users
      let userID = Object.keys(users);
      //Flip our coin
      var randomNumber = getRandomNumber();
      //Send back the roll result to our client
      io.sockets.emit('result', randomNumber);
      //Now continue our server sided calculations
      //If it rolled heads
      if(randomNumber == 1)
      {
        //If both users picked heads
        if(users[userID[0]].action == "heads" && users[userID[1]].action == "heads")
        {
          //Let both players know they drew
          io.sockets.emit("draw");
        }
        //If player one picked heads and player 2 picked tails
        else if(users[userID[0]].action == "heads" && users[userID[1]].action == "tails")
        {
          //Let player 1 know they won
          io.sockets.to(userID[0]).emit("win");
          //Let player 2 know they lost
          io.sockets.to(userID[1]).emit("lose");
        }
        else if(users[userID[0]].action == "tails" && users[userID[1]].action == "tails")
        {
          //Let both players know they drew
          io.sockets.emit("draw");
        }
        else if(users[userID[0]].action == "tails" && users[userID[1]].action == "heads")
        {
          //Let player 1 know they lost
          io.sockets.to(userID[0]).emit("lose");
          //Let player 2 know they won
          io.sockets.to(userID[1]).emit("win");
        }
      }
      //If it rolled tails
      else if(randomNumber == 2)
      {
        //If both users picked tails
        if(users[userID[0]].action == "tails" && users[userID[1]].action == "tails")
        {
          //Let both players know they drew
          io.sockets.emit("draw");
        }
        //Player 1 picks tails player 2 picks heads
        else if(users[userID[0]].action == "tails" && users[userID[1]].action == "heads")
        {
          //Let player 1 know they won
          io.sockets.to(userID[0]).emit("win");
          //Let player 2 know they lost
          io.sockets.to(userID[1]).emit("lose");
        }
        //Both players pick heads
        else if(users[userID[0]].action == "heads" && users[userID[1]].action == "heads")
        {
          //Let both players know they drew
          io.sockets.emit("draw");
        }
        else if(users[userID[0]].action == "heads" && users[userID[1]].action == "tails")
        {
          //Let player 1 know they lost
          io.sockets.to(userID[0]).emit("lose");
          //Let player 2 know they won
          io.sockets.to(userID[1]).emit("win");
        }
      }
    }
}); //End io

http.listen(3000, function(){
  console.log('listening on *:3000');
});


