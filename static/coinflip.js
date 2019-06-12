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
var log = document.getElementById("log");

var bankRoll = 100;
var moneyPerBet = 2;
var heads = 0;
var tails = 0;

/* Choosing a side */
sideOne.addEventListener("click", function()
{
coin.style.backgroundImage = "url('/static/heads.png')";
betSide.innerText = "heads";
this.style.boxShadow = "10px 10px 5px grey";
sideTwo.style.boxShadow = "";
log.innerText = "Press start to flip!";
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
tails = 1;
heads = 0;
});


/* Get random number 1 or 2 */
function getRandomNumber() {
  return Math.floor(Math.random() * (2 - 1 + 1)) + 1
}

/* On click of ready button flip our coin */
readyButton.addEventListener('click', function() {
  
  //Check if a bet on a side is placed
  if( heads == 0 && tails == 0)
  {
      log.innerText = "You must bet on a side!";
  }
  else
  {
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
         if( heads == 1)
         {
             bankRoll += sliderAmount;
             log.innerText = "Congratulations, you win! Please play again.";
             sideOne.style.boxShadow = "";
             sideTwo.style.boxShadow = "";
             heads = 0;
         }
         else
         {
             bankRoll -= sliderAmount;
             log.innerText = "You'll get em next time! Please play again.";
             sideOne.style.boxShadow = "";
             sideTwo.style.boxShadow = "";
             tails = 0;
         }
       } 
       else if (randomNumber == 2) {
         coin.style.backgroundImage = "url('/static/tails.png')";
         if(tails == 1)
         {
             bankRoll += sliderAmount;
             log.innerText = "Congratulations, you win! Please play again.";
             sideOne.style.boxShadow = "";
             sideTwo.style.boxShadow = "";
             tails = 0;
         }
         else
         {
             bankRoll -= sliderAmount;
             log.innerText = "You'll get em next time! Please play again.";
             sideOne.style.boxShadow = "";
             sideTwo.style.boxShadow = "";
             heads = 0;
         }
       }
       coin.classList.remove('toss');
     }, 800);

    }
});

function updateMoney()
{
    money.innerText = bankRoll;
    betAmount.innerText = slider.value;
    sliderAmount = parseInt(slider.value, 10);
}
        
setInterval(function()
{
    updateMoney();
}, 60);