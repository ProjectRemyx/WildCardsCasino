/* Referenced from: https://codepen.io/DylanMacnab/pen/YZXGmw */

//Get our DOM elements
var readyButton = document.getElementById('ready');
var coin = document.querySelector('.coinflip');
var money = document.getElementById("money");
var slider = document.getElementById("money-slider");
var betAmount = document.getElementById("bet-amount");
var betSide = document.getElementById("bet-side");
var sideOne = document.getElementById("heads");
var sideTwo = document.getElementById("tails");
var headsOption = document.getElementById("heads-option");
var tailsOption = document.getElementById("tails-option");
var decision = document.getElementById("decision");
var log = document.getElementById("log");

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
    money.innerText = bankRoll;
    betAmount.innerText = slider.value;
    betAmount.value = slider.value;
    sliderAmount = parseInt(slider.value, 10);
}
        
setInterval(function()
{
    updateMoney();
}, 60);

//Socket.io
$(function(){
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

        users.bet = $('#bet-amount').val(); //Get our bet amount
        users.action = $('#decision').val(); //Get our bet decision 
        socket.emit('Player Action', users); //Emit our information to the server
        log.innerText = "Bet Locked. Waiting on opponent."
        $('#decision').val(''); //Reset decision for next time
    }
  });

  //SOCKET LISTENERS - Listen for information from the server
  socket.on('sentAction', function(){
    log.innerText = "Your opponent has locked in a bet!";
  });

  socket.on('result', function(data){
    /* When you flip the coin change it so that in the air it's both */
    coin.style.backgroundImage = "url('/static/coin.png')";
    /* Add classes that do the flip animation */
    coin.classList.toggle('flip');
    coin.classList.add('toss');

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

  //If the player wins
  socket.on('win', function(){
    //Show our buttons
    readyButton.style.display = "block";
    sideOne.style.display = "block";
    sideTwo.style.display = "block";

    //Give us our money and display a message
    bankRoll += sliderAmount;
    log.innerText = "Congratulations, you won!";
    //Reset our controls
    sideOne.style.boxShadow = "";
    sideTwo.style.boxShadow = "";
    heads = 0;
    tails = 0;
  });
  //If the player loses
  socket.on('lose', function(){
    //Show our buttons
    readyButton.style.display = "block";
    sideOne.style.display = "block";
    sideTwo.style.display = "block";

    //Take away our money and display a message
    bankRoll -= sliderAmount;
    log.innerText = "You lost! Better luck next time!";
    //Reset our controls
    sideOne.style.boxShadow = "";
    sideTwo.style.boxShadow = "";
    heads = 0;
    tails = 0;
  });
  //If the player draws
  socket.on('draw', function(){
    //Show our buttons
    readyButton.style.display = "block";
    sideOne.style.display = "block";
    sideTwo.style.display = "block";

    //Display a message
    log.innerText = "You both drew! Flip again!";
    //Reset our controls
    sideOne.style.boxShadow = "";
    sideTwo.style.boxShadow = "";
    heads = 0;
    tails = 0;
  });


});