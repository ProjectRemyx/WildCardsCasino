/* Referenced from: https://codepen.io/DylanMacnab/pen/YZXGmw */

//Get our DOM elements
var readyButton = document.getElementById('ready');
var coin = document.querySelector('.coinflip');
var money = document.getElementById('money'); //Bank roll
var slider = document.getElementById('money-slider'); 
var betAmount = document.getElementById('bet-amount'); //Span betting amount
var betSide = document.getElementById('bet-side'); //Players picked side
var sideOne = document.getElementById('heads');
var sideTwo = document.getElementById('tails');
var headsOption = document.getElementById('heads-option');
var tailsOption = document.getElementById('tails-option');
var decision = document.getElementById('decision');
var log = document.getElementById('log'); //Player log
var radioButtons = document.getElementsByName('action'); //All radio buttons

var bankRoll = 100;
var moneyPerBet = 2;
var heads = 0;
var tails = 0;

let users = {};

/* Choosing a side */
sideOne.addEventListener("click", function()
{
coin.style.backgroundImage = "url('/static/heads.png')";
betSide.innerText = "heads";
this.style.boxShadow = "10px 10px 5px grey";
sideTwo.style.boxShadow = "";
log.innerText = "Press start to flip!";
decision.value = "heads";
heads = 1;
tails = 0;
});

sideTwo.addEventListener("click", function()
{
coin.style.backgroundImage = "url('/static/tails.png')";
betSide.innerText = "tails";
this.style.boxShadow = "10px 10px 5px grey";
sideOne.style.boxShadow = "";
log.innerText = "Press start to flip!";
decision.value = "tails";
tails = 1;
heads = 0;
});

function updateMoney()
{
    money.innerText = bankRoll; //Display bank roll at the top
    slider.max = bankRoll; //Change max slider amount to what we have in our bank
    betAmount.innerText = slider.value; //Span text change to slider value
    betAmount.value = slider.value; //Set span value to slider's value
    sliderAmount = parseInt(slider.value, 10); //Get our final bet $ in a variable
    if(bankRoll == 0)
    {
      log.innerText = "Bankrupt! To keep playing, load some more money."
      readyButton.style.display = "none";
      headsOption.style.display = "none";
      tailsOption.style.display = "none";
    }
}


setInterval(function()
{
    updateMoney();
}, 60);

function resetBet()
{
  for(i = 0; i < radioButtons.length; i++)
  {
    radioButtons[i].checked = false;
  }
}

//Socket.io
$(function(){
  var playerChoice = document.forms[0].action;
  var socket = io();
  //On click of our ready button
  $('#ready').click(function(e){
    if($('#decision').val() == '')
    {
      $('#log').text("Please pick an amount and side to bet on.");
      e.preventDefault(); //Stop page from loading
    }
    else
    {
        e.preventDefault(); //Stop page from loading
        //Get rid our controls after sending out 
        readyButton.style.display = "none";
        headsOption.style.display = "none";
        tailsOption.style.display = "none";

        // users.bet = $('#bet-amount').val(); //Get our bet amount
        // users.action = $('#decision').val(); //Get our bet decision 
        socket.emit('Player Action', playerChoice.value); //Emit our information to the server
        log.innerText = "Bet Locked. Waiting on opponent."
        $('#decision').val(''); //Reset decision for next time
    }
  });

  //SOCKET LISTENERS - Listen for information from the server
  socket.on('playerOverflow', function(){
    log.innerText = "2 Players are currently playing already";
  });
  socket.on('playerWait', function(){
    log.innerText = "Waiting for opponent to connect";
  });
  socket.on('maxPlayers', function(){
    log.innerText = "Please pick an amount and side to bet on."
  });
  socket.on('sentAction', function(){
    log.innerText = "Your opponent has locked in a bet!";
  });
  socket.on('disconnect', function(){
    log.innerText = "Your opponent disconnected!";
  });

  socket.on('result', function(data){
    /* When you flip the coin change it so that in the air it's both */
    coin.style.backgroundImage = "url('/static/coin.png')";
    /* Add classes that do the flip animation */
    coin.classList.toggle('flip');
    coin.classList.add('toss');
    socket.emit('resetBet'); //Server side reset, empty values on server
    // Waits 3sec to display flip result
    setTimeout(function() {
    //If returned coin flip is heads do our animations on the client side
    if(data == 1)
    {
      coin.style.backgroundImage = "url('/static/heads.png')";
    }
    else if(data == 2)
    {
      coin.style.backgroundImage = "url('/static/tails.png')";      
    }
    coin.classList.remove('toss');
    }, 800);

  });

  socket.on('resetBet', function(){
    resetBet(); //After making a round trip, come back and tell client to reset selection
  });

  //If the player wins
  socket.on('win', function(){
    //Show our buttons
    readyButton.style.display = "block";
    headsOption.style.display = "block";
    tailsOption.style.display = "block";

    //Give us our money and display a message
    bankRoll += sliderAmount;
    log.innerText = "Congratulations, you won!";
    //Reset our controls
    heads = 0;
    tails = 0;
  });
  //If the player loses
  socket.on('lose', function(){
    //Show our buttons
    readyButton.style.display = "block";
    headsOption.style.display = "block";
    tailsOption.style.display = "block";

    //Take away our money and display a message
    bankRoll -= sliderAmount;
    log.innerText = "You lost! Better luck next time!";
    //Reset our controls
    heads = 0;
    tails = 0;
  });
  //If the player draws
  socket.on('draw', function(){
    //Show our buttons
    readyButton.style.display = "block";
    headsOption.style.display = "block";
    tailsOption.style.display = "block";

    //Display a message
    log.innerText = "You both drew! Flip again!";
    //Reset our controls
    heads = 0;
    tails = 0;
  });


});