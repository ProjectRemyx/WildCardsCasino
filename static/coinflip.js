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


/* Get random number 1 or 2 */
function getRandomNumber() {
  return Math.floor(Math.random() * (2 - 1 + 1)) + 1
}

function startGame()
{
    let userID = Object.keys(users);
    /* When you flip the coin change it so that in the air it's both */
    coin.style.backgroundImage = "url('/static/coin.png')";
    /* Get our random number and put it into a variable */
    var randomNumber = getRandomNumber();
    /* Add classes that do the flip animation */
    coin.classList.toggle('flip');
    coin.classList.add('toss');
    
    // Waits 3sec to display flip result
    setTimeout(function() {
      if (randomNumber == 1) {
        coin.style.backgroundImage = "url('/static/heads.png')";
        if(users[userID[0]].action == "heads" && users[userID[1]].action == "heads")
        {
            bankRoll += sliderAmount;
            log.innerText = "Congratulations, you both win! Please play again.";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            heads = 0;
        }
        else if(users[userID[0]].action == "heads" && users[userID[1]].action == "tails")
        {
          bankRoll += sliderAmount;
          log.innerText = "Congratulations, you won! But your friend wasn't so lucky.";
          sideOne.style.boxShadow = "";
          sideTwo.style.boxShadow = "";
          heads = 0;
        }
        else if(users[userID[0]].action == "tails" && users[userID[1]].action == "tails")
        {
          bankRoll -= sliderAmount;
          log.innerText = "Aww man, you both lost.";
          sideOne.style.boxShadow = "";
          sideTwo.style.boxShadow = "";
          heads = 0;
        }
        else if(users[userID[0]].action == "tails" && users[userID[1]].action == "heads")
        {
          bankRoll -= sliderAmount;
          log.innerText = "Aww man you lost, but your friend won!";
          sideOne.style.boxShadow = "";
          sideTwo.style.boxShadow = "";
          heads = 0;
        }
        else
        {
            log.innerText = "Unrecorded Result";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            tails = 0;
            heads = 0;
        }
      } 
      else if (randomNumber == 2) {
        coin.style.backgroundImage = "url('/static/tails.png')";
        if(users[userID[0]].action == "tails" && users[userID[1]].action == "tails")
        {
            bankRoll += sliderAmount;
            log.innerText = "Congratulations, you both win! Please play again.";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            tails = 0;
        }
        else if(users[userID[0]].action == "tails" && users[userID[1]].action == "heads")
        {
            bankRoll += sliderAmount;
            log.innerText = "Congratulations, you won! But your friend wasn't so lucky.";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            tails = 0;
        }
        else if(users[userID[0]].action == "heads" && users[userID[1]].action == "heads")
        {
            bankRoll -= sliderAmount;
            log.innerText = "Aww man you both lost.";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            heads = 0;
        }
        else if(users[userID[0]].action == "heads" && users[userID[1]].action == "tails")
        {
            bankRoll -= sliderAmount;
            log.innerText = "Aww man you lost, but your friend won!";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            heads = 0;
        }
        else
        {
            log.innerText = "Unrecorded Result";
            sideOne.style.boxShadow = "";
            sideTwo.style.boxShadow = "";
            heads = 0;
            tails = 0;
        }
      }
      coin.classList.remove('toss');
    }, 800);
}

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
        if(tails == 1)
        {
          sideOne.style.display = "none";
        }
        else
        {
          sideTwo.style.display = "none";
        }

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

});