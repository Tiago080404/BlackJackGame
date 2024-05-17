const playButton = document.getElementById("play-button");
const hitButton = document.getElementById("hit-button");
const holdButton = document.getElementById("hold-button");
const restartButton = document.getElementById("restart-button");
const splitButton = document.getElementById("split-button");
const getBetButton = document.getElementById("get-bet");
const userBetInput = document.getElementById("user-bet");
const showPlayerMoney = document.getElementById("player-money");
const checkWinDisplay = document.getElementById("check-win");
//outgrey the buttons
playButton.disabled = true;
hitButton.disabled = true;
holdButton.disabled = true;
restartButton.disabled = true;
splitButton.disabled = true;

// Load player's money when the script starts
let playerMoney = parseInt(loadPlayerMoney());

//dealer and player Hand
let dealerhand = [];
let playerhand = [];

cards = [
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C",
  "9C",
  "10C",
  "KC",
  "QC",
  "JC",
  "AC",
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "10D",
  "KD",
  "QD",
  "JD",
  "AD",
  "2H",
  "3H",
  "4H",
  "5H",
  "6H",
  "7H",
  "8H",
  "9H",
  "10H",
  "KH",
  "QH",
  "JH",
  "AH",
  "2S",
  "3S",
  "4S",
  "5S",
  "6S",
  "7S",
  "8S",
  "9S",
  "10S",
  "KS",
  "QS",
  "JS",
  "AS",
];

cardsmap = {
  "2C": 2,
  "3C": 3,
  "4C": 4,
  "5C": 5,
  "6C": 6,
  "7C": 7,
  "8C": 8,
  "9C": 9,
  "10C": 10,
  KC: 10,
  QC: 10,
  JC: 10,
  AC: [1, 11],
  "2D": 2,
  "3D": 3,
  "4D": 4,
  "5D": 5,
  "6D": 6,
  "7D": 7,
  "8D": 8,
  "9D": 9,
  "10D": 10,
  KD: 10,
  QD: 10,
  JD: 10,
  AD: [1, 11],
  "2H": 2,
  "3H": 3,
  "4H": 4,
  "5H": 5,
  "6H": 6,
  "7H": 7,
  "8H": 8,
  "9H": 9,
  "10H": 10,
  KH: 10,
  QH: 10,
  JH: 10,
  AH: [1, 11],
  "2S": 2,
  "3S": 3,
  "4S": 4,
  "5S": 5,
  "6S": 6,
  "7S": 7,
  "8S": 8,
  "9S": 9,
  "10S": 10,
  KS: 10,
  QS: 10,
  JS: 10,
  AS: [1, 11],
};

function userBet() {
  if (userBetInput && userBetInput.value) {
    playButton.disabled = false;
  }
}

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function MainSetting() {
  let cardName;
  for (let i = 0; i < 2; i++) {
    cardName = cards.pop();
    playerhand.push(cardName);
    let cardImg = document.createElement("img");
    cardImg.src = `./static/${cardName}.png`;
    cardImg.style.width = "100px";
    cardImg.classList.add("card");
    document.getElementById("players-hand").appendChild(cardImg);

    //dealer hand
    //for the dealer
    cardName = cards.pop();
    dealerhand.push(cardName);
    let dealerCardImg = document.createElement("img");
    dealerCardImg.src = `./static/${cardName}.png`;
    dealerCardImg.style.width = "100px";
    dealerCardImg.classList.add("card");
    document.getElementById("dealers-hand").appendChild(dealerCardImg);
  }
  checkSplitCondition();
  console.log(playerhand);
  console.log(dealerhand);
}

function checkSplitCondition() {
  let pHand1 = cardsmap[playerhand[0]];
  let pHand2 = cardsmap[playerhand[1]];
  if (pHand1 === pHand2) {
    splitButton.disabled = false;
    console.log("it works");
  } else {
    console.log("does not work");
    splitButton.disabled = true;
  }
}

// Function to calculate the total value of cards in a hand
function calculateHandValue(hand) {
  let total = 0;
  let aceCount = 0;

  hand.forEach((card) => {
    if (card.startsWith("A")) {
      aceCount++;
    } else {
      total += cardsmap[card];
    }
  });

  // Add aces with flexible value
  for (let i = 0; i < aceCount; i++) {
    if (total + 11 <= 21) {
      total += 11;
    } else {
      total += 1;
    }
  }

  return total;
}

function updateDisplay() {
  showPlayerMoney.textContent = `Money ${playerMoney}`;
}

// Function to calculate the total value of cards in the player's hand
function calculatePlayerHandValue() {
  return calculateHandValue(playerhand);
}

// Function to calculate the total value of cards in the dealer's hand
function calculateDealerHandValue() {
  return calculateHandValue(dealerhand);
}

//Hit Function to let the player one more card
function Hit() {
  let cardName = cards.pop();
  playerhand.push(cardName);
  console.log(playerhand);
  let cardImg = document.createElement("img");
  cardImg.src = `./static/${cardName}.png`;
  cardImg.style.width = "100px";
  cardImg.classList.add("card");
  document.getElementById("players-hand").appendChild(cardImg);

  // Calculate player's hand value
  let totalPlayerValue = calculatePlayerHandValue();

  if (totalPlayerValue >= 21) {
    hitButton.disabled = true;
  }
}

function Hold() {
  hitButton.disabled = true; //disable the buttons
  playButton.disabled = true; //disable the buttons
  holdButton.disabled = true; //disable the buttons
  dealerLogic(); //calls dealerlogic because it is now the turn of the dealer
  savePlayerMoney(playerMoney);
}

function Split() {
  splitButton.disabled = true;

  // Create arrays to represent the split hands
  let playerSplittedHand1 = [playerhand[0]];
  let playerSplittedHand2 = [playerhand[1]];

  // Draw new cards for each split hand
  playerSplittedHand1.push(cards.pop());
  playerSplittedHand2.push(cards.pop());

  // Display the new cards for the split hands
  let cardImg1 = document.createElement("img");
  cardImg1.src = `./static/${playerSplittedHand1[1]}.png`;
  cardImg1.style.width = "100px";
  cardImg1.style.position = "absolute";
  cardImg1.style.left = "180px";
  cardImg1.style.top = "480px";
  cardImg1.classList.add("card");
  document.getElementById("players-hand").appendChild(cardImg1);

  let cardImg2 = document.createElement("img");
  cardImg2.src = `./static/${playerSplittedHand2[1]}.png`;
  cardImg2.style.width = "100px";
  cardImg2.style.position = "absolute";
  cardImg2.style.left = "280px";
  cardImg2.style.top = "480px ";
  cardImg2.classList.add("card");
  document.getElementById("players-hand").appendChild(cardImg2);

  console.log(
    `First hand: ${playerSplittedHand1}, Second hand: ${playerSplittedHand2}`
  );
  dealerLogicSplit(dealerhand, playerSplittedHand1, playerSplittedHand2);
}

function dealerLogic() {
  let cardName;
  let totalDealerValue = calculateDealerHandValue(); // Calculate dealer's total hand value
  let totalPlayerValue = calculatePlayerHandValue(); // Calculate player's total hand value
  //Dealer hits until hand value is 17 or higher
  while (totalDealerValue < 17) {
    console.log(dealerhand);
    cardName = cards.pop();
    dealerhand.push(cardName);
    let dealerCardImg = document.createElement("img");
    dealerCardImg.src = `./static/${cardName}.png`;
    dealerCardImg.style.width = "100px";
    dealerCardImg.classList.add("card");
    document.getElementById("dealers-hand").appendChild(dealerCardImg);
    totalDealerValue = calculateDealerHandValue();
  }

  checkWinner(totalPlayerValue, totalDealerValue);
}

function dealerLogicSplit(
  dealerhand,
  playerSplittedHand1,
  playerSplittedHand2
) {
  let totalDealerValue = calculateDealerHandValue();
  let totalPlayerValue1 = calculateHandValue(playerSplittedHand1);
  let totalPlayerValue2 = calculateHandValue(playerSplittedHand2);
  let cardName;
  while (totalDealerValue < 17) {
    console.log(dealerhand);
    cardName = cards.pop();
    dealerhand.push(cardName);
    let dealerCardImg = document.createElement("img");
    dealerCardImg.src = `./static/${cardName}.png`;
    dealerCardImg.style.width = "100px";
    dealerCardImg.classList.add("card");
    document.getElementById("dealers-hand").appendChild(dealerCardImg);
    totalDealerValue = calculateDealerHandValue();
  }
  checkWinnerSplit(totalDealerValue, totalPlayerValue1, totalPlayerValue2);
}

function checkWinner(totalPlayerValue, totalDealerValue) {
  if (totalPlayerValue > 21) {
    console.log("Player busts, dealer wins");
    checkWinDisplay.textContent = "You bust, dealer wins";
  } else if (totalDealerValue > 21 || totalPlayerValue > totalDealerValue) {
    console.log("Player wins");
    checkWinDisplay.textContent = "You win";
    playerMoney += parseInt(userBetInput.value) * 2;
    savePlayerMoney(playerMoney);
  } else if (totalDealerValue > totalPlayerValue) {
    console.log("Dealer wins");
    checkWinDisplay.textContent = "Dealer wins";
  } else {
    console.log("It's a tie");
    checkWinDisplay.textContent = "It's a tie";
    playerMoney += parseInt(userBetInput.value);
    savePlayerMoney(playerMoney);
  }
  updateDisplay();
}

function checkWinnerSplit(
  totalDealerValue,
  totalPlayerValue1,
  totalPlayerValue2
) {
  //first player hand check
  if (totalPlayerValue1 > 21) {
    console.log("Player first hand busts, dealer wins");
    checkWinDisplay.textContent = "You bust, dealer wins";
  } else if (totalDealerValue > 21 || totalPlayerValue1 > totalDealerValue) {
    console.log("first hand wins");
    checkWinDisplay.textContent = "first hand wins";
    playerMoney += parseInt(userBetInput.value) * 2;
    savePlayerMoney(playerMoney);
  } else if (totalDealerValue > totalPlayerValue1) {
    console.log("Dealer wins");
    checkWinDisplay.textContent = "Dealer wins";
  } else {
    console.log("It's a tie");
    checkWinDisplay.textContent = "It's a tie";
    playerMoney += parseInt(userBetInput.value);
    savePlayerMoney(playerMoney);
  }
  //second player hand check
  if (totalPlayerValue2 > 21) {
    console.log("Player second hand busts, dealer wins");
    checkWinDisplay.textContent = "You bust, dealer wins";
  } else if (totalDealerValue > 21 || totalPlayerValue2 > totalDealerValue) {
    console.log("second hand wins");
    checkWinDisplay.textContent = "Second hand wins";
    playerMoney += parseInt(userBetInput.value) * 2;
    savePlayerMoney(playerMoney);
  } else if (totalDealerValue > totalPlayerValue2) {
    console.log("Dealer wins");
    checkWinDisplay.textContent = "Dealer wins";
  } else {
    console.log("It's a tie");
    checkWinDisplay.textContent = "It's a tie";
    playerMoney += parseInt(userBetInput.value);
    savePlayerMoney(playerMoney);
  }
  updateDisplay();
}

function PlayGame() {
  playButton.disabled = true;
  hitButton.disabled = false;
  holdButton.disabled = false;
  restartButton.disabled = false;
  getBetButton.disabled = true;

  shuffle(cards);
  MainSetting();

  //minus 10
  playerMoney -= userBetInput.value;
  savePlayerMoney(playerMoney);

  console.log("Players money:", playerMoney);
  updateDisplay();
}

function restartGame() {
  location.reload(); //refreshes the Page
}

//Function to save player´s money to the localstorage
function savePlayerMoney(money) {
  localStorage.setItem("playerMoney", money);
}

//Function to load players money from localstorage
function loadPlayerMoney() {
  return localStorage.getItem("playerMoney");
}

//Save players money
savePlayerMoney(100);

// Event listeners for buttons
playButton.addEventListener("onclick", PlayGame);
hitButton.addEventListener("onclick", Hit);
holdButton.addEventListener("onclick", Hold);
getBetButton.addEventListener("click", userBet);
addEventListener("onclick", restartGame);
addEventListener("onclick", Split);
