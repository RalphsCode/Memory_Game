const gameContainer = document.getElementById("game");
const showClicksEl = document.getElementById("clickCount");
const recordEl = document.getElementById("record");
let flipCounter = 0, flips = [], clickCount = 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    // newDiv.style.backgroundColor = color;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
   
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// Call function that creates the Restart Button
restartGame();
recordReset()


// Function to handle a card click
function handleCardClick(event) {
  //  Increment the flipCounter & clickCount
  flipCounter++, clickCount++;
  //  Display the score
  showClicksEl.innerText = "Guesses: " + clickCount;
  //  Log the clicks
  console.log(`FlipCounter: ${flipCounter}`);
    //  Call relevant function based on 1 or 2 cards flipped over
    if (flipCounter <= 1) {
        // 1st card has been flipped - process the card
        flippedCard(event.target);
        }  // END if...
    else if (flipCounter == 2 ) {
        // 2nd card flipped - process the 2nd card & check for match
          matchCheck(flippedCard(event.target));
    }   // END else if...
    else {
        console.log('More than 2 cards have been flipped.');
        // console.log(`>=3 clicks, parent node= ${event.target.parentNode}`);
        return;
    }  // END else
}   // END handleCardClick()


//   Function to process the card that was flipped
function flippedCard(card) {
    // Find the color of the clicked card 
    const clickedColor = card.getAttribute('class');
    // Present the card color up
    card.style.backgroundColor = clickedColor;
    // Make the card unclickable
    card.removeEventListener('click', handleCardClick);
    // Put the color into the flips array
    flips.push(clickedColor);
    console.log(flips);
    // Return the card's color to the matchCheck if this is 2nd card
    return clickedColor;
}   // END flipCard()


  // Function to check for a match
  function matchCheck(clickedColor) {
    if (flips[0] != flips[1]) {
      // Cards do NOT match
      console.log('Flips different');
      nextRound();
    }   // END if...
    else {
      console.log('MATCHING FLIPS');
      const matched = document.querySelectorAll('.' + clickedColor);
      //  Iterate over the matched cards, and add class 'matched' to each card
      for (var i = 0; i < matched.length; i++) {
        matched[i].classList.add("matched");
      }
      // Continue with the game
      nextRound();
    } // END else
  }  // END matchCheck()


// Function to process cards & game after 2 cards were flipped
function nextRound(){
    //  Locate all the unMatched cards
    const unmatchedCards = gameContainer.querySelectorAll(':not(.matched');
    console.log(`unmatched cards: ${unmatchedCards.length}`);
      // If 2 cards have been flipped
      if (flipCounter == 2){
        // Turn off all click event listeners
        for (var t = 0; t < unmatchedCards.length; t++) {
          unmatchedCards[t].removeEventListener('click', handleCardClick);
        }  // END for loop
        // Wait a second then reset the unmatched cards
        setTimeout(resetCards, 1000);

        // flip cards back (reset them) & add back the click eventListener
        function resetCards() {
          for (var i = 0; i < unmatchedCards.length; i++) {
            unmatchedCards[i].style.backgroundColor = 'white';
            unmatchedCards[i].addEventListener('click', handleCardClick);
          }  // END for loop...
        }  // END resetCards()
      }  // END if...
    //  Reset the flip count, and the array of flipped cards
    flipCounter = 0;
    flips = [];
    if (unmatchedCards.length == 0){
        // If all matches discovered; check the score vs the record
        record();
    }  // END if...
}  // END nextRound()


// Function to set or update Local Storage
function record(){
  let record = localStorage.getItem('record');
  console.log(`record from local Storage = ${record}`)
  if (localStorage.getItem('record') != undefined ) {
      if (clickCount <= record) {
      record = clickCount
      localStorage.setItem("record", clickCount);
      recordEl.innerHTML = `   - Record: ${record} <button class = 'button' id='reset score'>Reset Record</button>`;
      window.alert(`NEW RECORD - ${clickCount}!!!`);
    }}
  else { localStorage.setItem("record", clickCount);
    recordEl.innerHTML += `   - Record: ${clickCount} <button class = 'button' id='reset score'>Reset Record</button>`;

  } // END else...
} // END record()


// Function to restart Game
function restartGame() {
  console.log('restartGame is running.')
  // Reload page if Restart button is clicked
  const restartBtn = document.querySelector('#restart');
  restartBtn.addEventListener('click', function() {
    location.reload()}) ;
    if (localStorage.getItem('record')) {
      recordEl.innerHTML += `   - Record: ${localStorage.getItem('record')}<button class = 'button' id='reset score'>Reset Record</button>`;
    } // END if...
}   // END restartGame()


// Function to reset the record score
function recordReset(){
  // Check that there is a record to clear
  if (localStorage.getItem('record')){
    // Fine the reset btn and add click listener
    const scoreResetBtn = document.getElementById('reset score');
    scoreResetBtn.addEventListener('click', function(){
    // Remove the record from Local Storage
    localStorage.removeItem('record');
    // Clear the record from the screen
    recordEl.innerHTML = '';
    })  // END scoreResetBtn()
  }  // END if...
} // END recordReset()

// when the DOM loads
createDivsForColors(shuffledColors);