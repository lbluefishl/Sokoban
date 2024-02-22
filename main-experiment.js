const TILE_SIZE = 50; // Define the size of each tile on the canvas
const BROWN_COLOR = "#D2B48C"; // Light brown color for background
const GREEN_COLOR = "#0000FF"; // blue color for target tiles
const wallSprite = new Image();
const boxSprite = new Image();
const playerSprite = new Image();
const spriteSize = TILE_SIZE * 0.8;
const loadingScreen = document.getElementById("loadingScreen");
const levelDisplay = document.getElementById("currentLevel");
const skipButton = document.getElementById('skip');
const pilotButton = document.getElementById('pilot');
const xOffset = (TILE_SIZE - spriteSize) / 2;
const yOffset = (TILE_SIZE - spriteSize) / 2;
const canvas = document.getElementById("gameCanvas");
const prolificPID = localStorage.getItem('prolificPID');
const studyID = localStorage.getItem('studyID');
const sessionID = localStorage.getItem('sessionID');
const maxTime = 180000;
const halfTime = 120000;

let isRedirecting = false;
let timer;


let currentLevel;
let levelArray; 
let gameStateHistory = []; 
let timeAtInitialize;
let timeBeforeBreak;
let timeAtWin;
let moveset = [];

wallSprite.src = "images/wall.jpg";
boxSprite.src = "images/box.png";
playerSprite.src = "images/player.png"


/*
function generateTrialOrder(difficulty) {
if (difficulty == 'easy') 
  {
    trialOrder = easyTrials[trialRandomIndex];
  }
  else {
    trialOrder = hardTrials[trialRandomIndex];
  }
  localStorage.setItem('trial', JSON.stringify(trialOrder));
  localStorage.setItem('trialOrder', JSON.stringify(trialOrder));
}
*/




// Function to load the level data from a file
function loadLevelData(filename) {
  return fetch(filename)
    .then(response => response.text())
    .then(data => data.trim());
}

// Function to parse the level data and create a 2D array
function parseLevelData(levelData) {
  const lines = levelData.split("\n");
  const levelArray = lines.map(line => line.split(""));
  return levelArray;
}

// Function to find the player's starting position in the level
function findPlayerStartingPosition(levelArray) {
  for (let y = 0; y < levelArray.length; y++) {
    for (let x = 0; x < levelArray[y].length; x++) {
      if (levelArray[y][x] === "+" || levelArray[y][x] === "@") {
        return { x, y };
      }
    }
  }
  return null; // If player's starting position is not found
}

// Function to check if a box can be pushed in a specific direction
function canPushBox(x, y, dx, dy) {
  const targetX = x + dx;
  const targetY = y + dy;
  const targetCell = levelArray[targetY][targetX];

  // A box can be pushed if the target cell is an empty space or another target tile
  return targetCell === " " || targetCell === ".";
}

// Function to handle player movement and box movement
function handlePlayerMove(dx, dy) {
  const playerPos = findPlayerStartingPosition(levelArray); // Get the initial player position
  const targetX = playerPos.x + dx;
  const targetY = playerPos.y + dy;
  const targetCell = levelArray[targetY][targetX];
  const playerCell = levelArray[playerPos.y][playerPos.x];
  const boxTarget = levelArray[targetY + dy][targetX + dx];

  // Check if the target cell is an empty space, a target tile, or a box
  if (targetCell === " " || targetCell === "." || targetCell === "$" || targetCell === "*") {
    // If the target cell is a box, check if it can be pushed in the specified direction
    if ((targetCell === "$" || targetCell === "*") && !canPushBox(targetX, targetY, dx, dy)) {
      // If the box cannot be pushed, ignore the move
      return;
    }

    // Record the previous state only if the move is successful
    const previousState = JSON.parse(JSON.stringify(levelArray));


    // Update the level array with the new player position
    if (targetCell === " " || targetCell === "$") {
      levelArray[targetY][targetX] = "@"; // Move to an empty space
    } else {
      levelArray[targetY][targetX] = "+";
    }// Move to a target tile


    if (boxTarget === " " && (targetCell === "$" || targetCell === "*")) {
      levelArray[targetY + dy][targetX + dx] = "$"
    } else if (boxTarget === "." && (targetCell === "$" || targetCell === "*")) {
      levelArray[targetY + dy][targetX + dx] = "*"
    }
    // move box

    // Update the cell the player was originally in if it was a target tile
    if (playerCell === "+") {
      levelArray[playerPos.y][playerPos.x] = "."; // Change player's previous cell to regular target tile
    } else {
      levelArray[playerPos.y][playerPos.x] = " ";
    }

    capturePlayerMove(dx, dy);
    gameStateHistory.push(previousState);
    checkRepetitiveMoves();
    renderLevel(levelArray);
    checkWinCondition();
  }
}

function checkRepetitiveMoves() {
  // check 2 states before
  if (gameStateHistory.length < 2) return;
  for (let i = gameStateHistory.length - 2 ; i >= 0; i--) {
    if (JSON.stringify(gameStateHistory[i]) === JSON.stringify(levelArray)) {
      console.log('same array')
      moveset.splice(i); 
      gameStateHistory.splice(i);
      return;
    }
  }
}

// Event listener for keyboard arrow key press
function handleKeyDown(event) {
  const key = event.key;

  if ( key === 'ArrowUp' || key === 'ArrowDown') 
    event.preventDefault();

  switch (key) {
    case "ArrowLeft":
      handlePlayerMove(-1, 0);
      break;
    case "ArrowUp":
      handlePlayerMove(0, -1);
      break;
    case "ArrowRight":
      handlePlayerMove(1, 0);
      break;
    case "ArrowDown":
      handlePlayerMove(0, 1);
      break;
 //   case "u":
 //     undoLastMove();
 //     break;
    case "r":
      resetLevel();
      break;
    default:
      break;
  }
}

document.addEventListener("keydown", handleKeyDown);



function loadAndRenderLevel(levelFile) {
  loadLevelData(levelFile)
    .then(levelData => {
      levelArray = parseLevelData(levelData);
      const playerStartPosition = findPlayerStartingPosition(levelArray);
      playerX = playerStartPosition.x;
      playerY = playerStartPosition.y;
      gameStateHistory = [];
      renderLevel(levelArray);
    })
    .catch(error => {
      console.error("Error loading or parsing the level data:", error);
    });
}




function renderLevel(levelArray) {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Set the canvas size based on the level data dimensions
  canvas.width = 18 * TILE_SIZE;
  canvas.height = 12 * TILE_SIZE;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the default light brown background for all tiles
  ctx.fillStyle = BROWN_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // Draw the level content (walls, targets, boxes, player)
  for (let row = 0; row < levelArray.length; row++) {
    for (let col = 0; col < levelArray[row].length; col++) {
      const cell = levelArray[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      // Draw the background color based on the character cell
      switch (cell) {
        case "#":
          ctx.drawImage(wallSprite, x, y, TILE_SIZE, TILE_SIZE);
          break;
        case "$":
          ctx.drawImage(boxSprite, x + xOffset, y + yOffset, spriteSize, spriteSize);
          break;
        case "@":
          ctx.drawImage(playerSprite, x + xOffset, y + yOffset, spriteSize, spriteSize);
          break;
        case ".":
          // target tile
          ctx.fillStyle = GREEN_COLOR;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          break;
        case "+":
          // Draw the player on target tile
          ctx.fillStyle = GREEN_COLOR;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.drawImage(playerSprite, x + xOffset, y + yOffset, spriteSize, spriteSize);
          break;
        case "*":
          // Draw the brown box on top of the green target background
          ctx.fillStyle = GREEN_COLOR;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); // 
          ctx.drawImage(boxSprite, x + xOffset, y + yOffset, spriteSize, spriteSize);
          break;
        default:
          // Draw the light brown background for all other cases (including blank space)
          ctx.fillStyle = BROWN_COLOR; // Default background color
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); // Draw the background
          break;
      }
    }
  }
  setTimeout(() => {
    loadingScreen.style.display = "none";},2000)
}




initializeGame();

// Function to reset the level to its initial state
function resetLevel() {
  loadLevelData(currentLevel)
    .then(levelData => {

      levelArray = parseLevelData(levelData);
      const playerStartPosition = findPlayerStartingPosition(levelArray);
      playerX = playerStartPosition.x;
      playerY = playerStartPosition.y;
      saveMoveset();
      gameStateHistory = [];
      renderLevel(levelArray);
      timeCheck();
    })
    .catch(error => {
      console.error("Error loading or parsing the level data:", error);
    });
    
}




/*
function undoLastMove() {
  // Check if there's a previous state in the history
  if (gameStateHistory.length > 0) {
    // Pop the last state from the history and set it as the current state
    levelArray = gameStateHistory.pop();
    moveset.pop();
    // Render the game state after undoing the move
    renderLevel(levelArray);
  }
}
*/

// Assuming you have the levelArray defined and filled with the level data

function checkWinCondition() {
  for (let row = 0; row < levelArray.length; row++) {
    for (let col = 0; col < levelArray[row].length; col++) {
      if (levelArray[row][col] === "$") {
        return false; // There is still at least one box left, so the player has not won
      }
    }
  }

  // Assuming you meet win conditions, store participant data and move to new level
  const playerId = localStorage.getItem('playerId');
  const currentLevelNumber = localStorage.getItem('currentLevelNumber');
  localStorage.setItem('completedLevel', "1");
  recordTimeAtWin();
  saveMoveset();
  recordUserCompletion();
  removeCondition();
  determineNextLevel();
  clearLocalStorageExceptPlayerId();
  generateNewLevel();
}






function initializeGame() {

  loadingScreen.style.display = "flex";


  Promise.all([
    imageLoaded(wallSprite),
    imageLoaded(boxSprite),
    imageLoaded(playerSprite),
  ])
    .then(() => {
    getplayerId();
    currentLevel = 'levels/level1.txt'
    loadAndRenderLevel(currentLevel);
    
    recordTimeAtInitialize();
    storeLevelNumber();
    showLevel();
})
    .catch((error) => {
      console.error("Error loading sprites:", error);
    });
   
}


function imageLoaded(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      // If the image is already loaded, resolve the Promise immediately
      resolve();
    } else {
      // If the image is not yet loaded, add an event listener to resolve the Promise when it's loaded
      img.addEventListener("load", () => {
        resolve();
      });
      // If there's an error loading the image, reject the Promise
      img.addEventListener("error", (error) => {
        reject(error);
      });
    }
  });
}


function redirectToSummary() {
  // Show the custom modal
  const modal = document.getElementById("customModal");
  modal.style.display = "block";
  const summaryBtn = document.getElementById("summaryBtn");

  summaryBtn.addEventListener("click", function () {
    isRedirecting = true;
    localStorage.setItem('completedAllLevels', 1);
    window.location.href = "summary.html";
  });


}






function generateUniqueID() {
  const timestamp = new Date().getTime(); // Get the current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999

  // Concatenate the timestamp and random number to create the unique ID
  const uniqueID = `${timestamp}${randomNum}`;

  return uniqueID;
}




function getplayerId() {
  // Check if the unique ID is already stored in localStorage
  let playerId = localStorage.getItem("playerId");
  if (!playerId) {
    // If the unique ID doesn't exist, generate a new one and store it in localStorage
    playerId = generateUniqueID();
    localStorage.setItem("playerId", playerId);
  }
  return playerId;
}







function capturePlayerMove(dx, dy) {
  // Convert the move (dx, dy) into a direction (left, right, up, or down)
  let direction;
  if (dx === -1) direction = "l";
  else if (dx === 1) direction = "r";
  else if (dy === -1) direction = "u";
  else if (dy === 1) direction = "d";
  else return; // Invalid move (dx and dy should be either -1, 0, or 1)

  // Push the direction to the moveset array
  moveset.push(direction);
}


function recordUserCompletion() {

  const data = {
    playerId: localStorage.getItem('playerId'),
    durationAfterBreak: localStorage.getItem('durationAfterBreak'),
    durationBeforeBreak: localStorage.getItem('durationBeforeBreak'),
    durationToBeatGame: localStorage.getItem('durationToBeatGame'),
    durationBreak: localStorage.getItem('durationBreak'),
    levelNumber: localStorage.getItem('currentLevelNumber'),
    completedLevel: localStorage.getItem('completedLevel'),
    difficultyValue: localStorage.getItem('difficulty'),
    scrollCount: localStorage.getItem('scroll'),
    stuckValue: localStorage.getItem('stuck'),
    confidence_before: localStorage.getItem('confidence_before'),
    r1b: localStorage.getItem('r1b'),
    r2b: localStorage.getItem('r2b'),
    r3b: localStorage.getItem('r3b'),
    correctValue: localStorage.getItem('correct'),
    incorrectValue: localStorage.getItem('incorrect'),
     prolificPID: localStorage.getItem('prolificPID'),
     studyID: localStorage.getItem('studyID'),
     sessionID: localStorage.getItem('sessionID'),
    condition: JSON.parse(localStorage.getItem('condition'))[0],
    beforeBreakMovesets: JSON.parse(localStorage.getItem('beforeBreakMovesets') || '[]').map(arr => [arr.join('')]),
    afterBreakMovesets: JSON.parse(localStorage.getItem('afterBreakMovesets') || '[]').map(arr => [arr.join('')])
  };
  
  fetch('https://sokoban-badc101a491f.herokuapp.com/complete-level', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (response.ok) {
      console.log('User completion recorded successfully!');
    } else {
      console.log('Error recording user completion:', response.status);
    }
  })
  .catch(error => {
    console.error('Error recording user completion:', error);
  });
}



function getTimestamp() {
  return new Date().toISOString();
}


function recordTimeAtInitialize() {
  localStorage.setItem('timeAtInitialize', getTimestamp());
}

function recordTimeBeforeBreak() {
  localStorage.setItem('timeBeforeBreak', getTimestamp());
}

function recordTimeAfterBreak() {
  localStorage.setItem('timeAfterBreak', getTimestamp());
}


function recordTimeAtWin() {
  timeAtWin = getTimestamp();
  localStorage.setItem('timeAtWin', timeAtWin);
  timeBeforeBreak = localStorage.getItem('timeBeforeBreak');
  timeAfterBreak = localStorage.getItem('timeAfterBreak');
  timeAtInitialize = localStorage.getItem('timeAtInitialize');
  // Calculate time intervals
  const durationToBeatGame = ((new Date(timeAtWin) - new Date(timeAtInitialize))/1000).toFixed(2);
  const durationBeforeBreak = timeBeforeBreak ? ((new Date(timeBeforeBreak) - new Date(timeAtInitialize))/1000).toFixed(2) : null;
  const durationAfterBreak = timeBeforeBreak ? ((new Date(timeAtWin) - new Date(timeAfterBreak))/1000).toFixed(2) : null;
  const durationBreak = timeBeforeBreak ? ((new Date(timeAfterBreak) - new Date(timeBeforeBreak))/1000).toFixed(2) : null; 
  // Store time intervals in localStorage
  localStorage.setItem('durationToBeatGame', durationToBeatGame);
  localStorage.setItem('durationBeforeBreak', durationBeforeBreak);
  localStorage.setItem('durationAfterBreak', durationAfterBreak);
  localStorage.setItem('durationBreak', durationBreak);
}


function storeLevelNumber() {
  localStorage.setItem('currentLevelNumber', parseInt(currentLevel.split("level")[2].split(".")[0]));
}



function saveMoveset() {
  const timeBeforeBreak = localStorage.getItem('timeBeforeBreak');
  if (timeBeforeBreak) {
    // Player took a break, store moveset in "After Break Movesets" array
    const afterBreakMovesets = JSON.parse(localStorage.getItem('afterBreakMovesets') || '[]');
    afterBreakMovesets.push(moveset);
    localStorage.setItem('afterBreakMovesets', JSON.stringify(afterBreakMovesets));
  } else {
    // Player did not take a break, store moveset in "Before Break Movesets" array
    const beforeBreakMovesets = JSON.parse(localStorage.getItem('beforeBreakMovesets') || '[]');
    beforeBreakMovesets.push(moveset);
    localStorage.setItem('beforeBreakMovesets', JSON.stringify(beforeBreakMovesets));
  }
  moveset = [];
}





function clearLocalStorageExceptPlayerId() {
  // clears local storage except for playerID, condition, and trial so that it is kept for further trials; condition array is reduced until it is empty so that all participants participate in all conditions
   const playerId = localStorage.getItem('playerId'); 
   const playerCondition = JSON.parse(localStorage.getItem('condition'));
   const playerTrial = JSON.parse(localStorage.getItem('trial'));
   const prolificPID = localStorage.getItem('prolificPID');
   const sessionID = localStorage.getItem('sessionID');
   const studyID = localStorage.getItem('studyID');
   const trialOrder = localStorage.getItem('trialOrder');
   const conditionOrder = localStorage.getItem('conditionOrder');
   const idleTime = localStorage.getItem('idleTime');
   localStorage.clear(); 
   localStorage.setItem('playerId', playerId); 
   localStorage.setItem('condition', JSON.stringify(playerCondition));
   localStorage.setItem('trial', JSON.stringify(playerTrial));
   localStorage.setItem('prolificPID', prolificPID);
   localStorage.setItem('sessionID', sessionID);
   localStorage.setItem('studyID', studyID);
   localStorage.setItem('trialOrder', trialOrder);
   localStorage.setItem('conditionOrder', conditionOrder);
   localStorage.setItem('idleTime', idleTime);
 }
 

function showLevel() {
  levelDisplay.innerHTML = localStorage.getItem('currentLevelNumber')
}



function initialTimePassed() {
  const timeAfterBreak = localStorage.getItem('timeAfterBreak'); // If break already taken, do not prompt another break. Else check if time has passed for break. 
  if (timeAfterBreak) {

    return false; 
  }
 // 2 minutes 
  return new Date() - new Date(localStorage.getItem('timeAtInitialize')) > halfTime ;
}

function totalTimePassed() {
  const timeAfterBreak = localStorage.getItem('timeAfterBreak');
  if (timeAfterBreak === null || timeAfterBreak === undefined) {
    return false; 
  }
  // 2 minutes
  return new Date() - new Date(timeAfterBreak) > halfTime ;
}

function generateNewLevel() {
  loadAndRenderLevel(currentLevel);
  storeLevelNumber();
  showLevel();
  recordTimeAtInitialize();
  resetTimer();
}
  
function determineNextLevel() {
  const currentLevelNumber = localStorage.getItem('currentLevelNumber'); 

  if (parseInt(currentLevelNumber) > 2) {
    const trials = JSON.parse(localStorage.getItem('trial'));
    currentLevel = `levels/level${trials[0]}.txt`;
    trials.shift();
    localStorage.setItem('trial', JSON.stringify(trials));
  } else {
    currentLevel = `levels/level${parseInt(localStorage.getItem('currentLevelNumber'))+1}.txt`
  }

}

function skipLevel() {
  localStorage.setItem('completedLevel', "0");
  recordTimeAtWin();
  saveMoveset();
  recordUserCompletion();
  removeCondition();
  determineNextLevel();
  clearLocalStorageExceptPlayerId();
  generateNewLevel();
}

function timeCheck() {

  // check if in a practice round. If not, assign participant to break task or move to next level
  const currentLevelNumber = parseInt(localStorage.getItem('currentLevelNumber'));
  if (currentLevelNumber < 4) return;
  if (totalTimePassed()) {
    showPopup("Thank you for your effort on this puzzle. You will now move on.","nextlevel");
    return
  } else if (initialTimePassed()) {
    if (JSON.parse(localStorage.getItem('condition'))[0] == 1) {
      showPopup("Respond to the following statements with the option which best represents how you currently feel. You will then continue working on the puzzle.","control");
      return
    }
    showPopup("Please respond to the following statements. Afterwards, you will take a short break prior to resuming work on the puzzle. ","break");
    
  }
}

function showPopup(message, type) {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  const confirmButton = document.getElementById('confirm-button');
  const form = document.getElementById('difficulty-form');
  const continueButton = document.getElementById('continue-button');
  overlay.style.display = 'block';
  popup.style.display = 'block';
  popupMessage.innerHTML = message;
  form.reset();
  document.removeEventListener("keydown", handleKeyDown);

  
function removePopup() {
  confirmButton.removeEventListener('click', handleBreakClick);
  continueButton.removeEventListener('click', handleNextLevelClick);
  confirmButton.removeEventListener('click', handleContinueClick);
  form.style.display = 'none';
  overlay.style.display = 'none';
  popup.style.display = 'none';
  continueButton.style.display = 'none';
  document.addEventListener("keydown", handleKeyDown);
}

  if (type === 'control') {
    form.style.display = 'block';
    recordTimeBeforeBreak();
    confirmButton.addEventListener('click', handleContinueClick)
  }

  if (type === 'break') {
    form.style.display = 'block';
    recordTimeBeforeBreak();
    confirmButton.addEventListener('click', handleBreakClick);
  }

  if (type === 'nextlevel') {
    continueButton.style.display = 'inline';
    continueButton.addEventListener('click', handleNextLevelClick);
  }

  function handleContinueClick(event) {
    event.preventDefault();
    localStorage.setItem('difficulty', document.querySelector('input[name="difficulty-puzzle"]:checked').value);
    localStorage.setItem('stuck', document.querySelector('input[name="stuck-feeling"]:checked').value);
    localStorage.setItem('confidence_before', document.querySelector('input[name="confidence_before"]:checked').value);
    localStorage.setItem('r1b', document.querySelector('input[name="r1b"]:checked').value);
    localStorage.setItem('r2b', document.querySelector('input[name="r2b"]:checked').value);
    localStorage.setItem('r3b', document.querySelector('input[name="r3b"]:checked').value);
    removePopup();
    recordTimeAfterBreak();
    resetTimer();
  }

  function handleBreakClick(event) {
    event.preventDefault();
    localStorage.setItem('difficulty', document.querySelector('input[name="difficulty-puzzle"]:checked').value);
    localStorage.setItem('stuck', document.querySelector('input[name="stuck-feeling"]:checked').value);
    localStorage.setItem('confidence_before', document.querySelector('input[name="confidence_before"]:checked').value);
    localStorage.setItem('r1b', document.querySelector('input[name="r1b"]:checked').value);
    localStorage.setItem('r2b',  document.querySelector('input[name="r2b"]:checked').value);
    localStorage.setItem('r3b',  document.querySelector('input[name="r3b"]:checked').value);
    removePopup();
    const gameState = {
      currentLevel: currentLevel,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    redirectToBreak();
  }

  function handleNextLevelClick(event) {
    event.preventDefault();
    removePopup();
    skipLevel();
  }


}



// redirects participants to the corresponding type of break condition
function redirectToBreak() {
  participantCondition = JSON.parse(localStorage.getItem('condition'))[0];
  isRedirecting = true;
  window.location.href =  `break-${participantCondition}.html`;
}
 
// participant is in each condition until no more conditions remain. At that point they finish with a survey. 
function removeCondition() {
  const participantCondition = JSON.parse(localStorage.getItem('condition'));
  participantCondition.shift();
  if (participantCondition.length === 0) redirectToSummary();
  localStorage.setItem('condition',JSON.stringify(participantCondition));
}




window.addEventListener("beforeunload", function (e) {
  if (!isRedirecting) {
    // Display a confirmation message
    e.preventDefault();
    var confirmationMessage = "This experiment must be done in one sitting continuously. If you refresh the page or go back, the study will end and you will not be compensated for your time.";

    // Set the confirmation message for modern browsers
    e.returnValue = confirmationMessage;

    // For older browsers
    return confirmationMessage;
  }
});



// enforce 10 minute timer if user unable to complete pratice trials
setTimeout(exitStudy, 600000);

function exitStudy() {
  if (JSON.parse(localStorage.getItem('condition')).length > 3) {
    isRedirecting = true;
    alert('Thank you for your participation in this study. Please complete the summary form.')
    localStorage.setItem('completedAllLevels', 0);
    window.location.href = "summary.html";
  }
}


function startTimer() {
  timer = setTimeout(timeCheck, maxTime);
}

function resetTimer() {
  if (JSON.parse(localStorage.getItem('condition'))[0] == undefined) return;
  clearTimeout(timer); // Clear the existing timer
  startTimer(); // Start a new timer
}




let lastActiveTime = Date.now();
let idleInterval = setInterval(timerIncrement, 60000); 

function timerIncrement() {
    let currentTime = Date.now();
    let idleTime = (currentTime - lastActiveTime) / (60000); 
    let storedIdleTime = parseInt(localStorage.getItem('idleTime'));
    storedIdleTime += idleTime;
    localStorage.setItem('idleTime', storedIdleTime);
    lastActiveTime = Date.now();
}

// Reset idle time on user interaction
function resetIdleTime() {
    lastActiveTime = Date.now();
}



document.addEventListener('mousemove', resetIdleTime);
document.addEventListener('keypress', resetIdleTime);




// enforce 3 minute timer if user working
startTimer();
