/* Referenced from: https://codepen.io/DylanMacnab/pen/YZXGmw */

//Get our DOM elements
var readyButton = document.getElementById('ready');
var coin = document.querySelector('.coinflip');

/* Get random number 1 or 2 */
function getRandomNumber() {
  return Math.floor(Math.random() * (2 - 1 + 1)) + 1
}

/* On click of ready button flip our coin */
readyButton.addEventListener('click', function() {
  /* When you flip the coin change it so that in the air it's both */
  coin.style.backgroundImage = "url('/static/coin.png')";
  var randomNumber = getRandomNumber();
  coin.classList.toggle('flip');
  coin.classList.add('toss');
  
  // Waits 3sec to display flip result
  setTimeout(function() {
    if (randomNumber == 1) {
      coin.style.backgroundImage = "url('/static/heads.png')";
    } else if (randomNumber == 2) {
      coin.style.backgroundImage = "url('/static/tails.png')";
    }
    coin.classList.remove('toss');
  }, 800);
    
});