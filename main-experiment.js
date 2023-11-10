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

const levelFiles = [
  "level1.txt",
  "level2.txt",
  "level3.txt",
  "level4.txt",
  "level5.txt",
  "level6.txt",
  "level7.txt",
  "level8.txt",
  "level9.txt",
  "level10.txt",
  
];
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
    renderLevel(levelArray);
    checkWinCondition();
  }
}

// Event listener for keyboard arrow key press
document.addEventListener("keydown", function (event) {
  // Arrow keys: Left (37), Up (38), Right (39), Down (40)
  const key = event.keyCode;
  switch (key) {
    case 37: // Left arrow key
      handlePlayerMove(-1, 0);
      break;
    case 38: // Up arrow key
      handlePlayerMove(0, -1);
      break;
    case 39: // Right arrow key
      handlePlayerMove(1, 0);
      break;
    case 40: // Down arrow key
      handlePlayerMove(0, 1);
      break;
    case 85:
      undoLastMove();
      break;
    default:
      break;

  }
});




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
      saveMoveset(moveset);
      gameStateHistory = [];
      renderLevel(levelArray);
      timeCheck();
    })
    .catch(error => {
      console.error("Error loading or parsing the level data:", error);
    });
}

// Event listener to detect "R" key press for restarting the level
document.addEventListener("keydown", event => {
  if (event.key === "r" || event.key === "R") {
    resetLevel();
  }
});



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
  recordUserCompletion(playerId);
  saveMoveset(moveset);
  pushMovesetsToDatabase(playerId, currentLevelNumber);
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
  // Check if there is a stored game state in localStorage
  const storedGameState = localStorage.getItem('gameState');
  if (storedGameState) {
    // Parse and set the game state variables
    const gameState = JSON.parse(storedGameState);
    currentLevel = gameState.currentLevel;
    loadAndRenderLevel(currentLevel);
  } else {
    // No stored game state, load a random level
    currentLevel = 'levels/level1.txt'
    loadAndRenderLevel(currentLevel);
    recordTimeAtInitialize();
  }
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





function recordUserCompletion(playerId) {
  const url = 'https://sokoban-badc101a491f.herokuapp.com/complete-level';
  
  const data = {
    playerId: playerId,
    durationAfterBreak: localStorage.getItem('durationAfterBreak'),
    durationBeforeBreak: localStorage.getItem('durationBeforeBreak'),
    durationToBeatGame: localStorage.getItem('durationToBeatGame'),
    durationBreak: localStorage.getItem('durationBreak'),
    levelNumber: localStorage.getItem('currentLevelNumber'),
    completedLevel: localStorage.getItem('completedLevel'),
    condition: JSON.parse(localStorage.getItem('condition'))[0]
  };
  
  fetch(url, {
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
  timeAtInitialize = getTimestamp();
  localStorage.setItem('timeAtInitialize', timeAtInitialize);
}

function recordTimeBeforeBreak() {
  timeBeforeBreak = getTimestamp();
  localStorage.setItem('timeBeforeBreak', timeBeforeBreak);
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



function saveMoveset(moveset) {
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


function pushMovesetsToDatabase(playerId, levelNumber) {
  const url = 'https://sokoban-badc101a491f.herokuapp.com/save-movesets';
  const beforeBreakMovesets = JSON.parse(localStorage.getItem('beforeBreakMovesets') || '[]');
  const afterBreakMovesets = JSON.parse(localStorage.getItem('afterBreakMovesets') || '[]');

  const movesetData = {
    playerId: playerId,
    levelNumber: levelNumber,
    beforeBreakMovesets: beforeBreakMovesets,
    afterBreakMovesets: afterBreakMovesets
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movesetData)
  })
    .then(response => {
      if (response.ok) {
        console.log('Moveset data sent to the database successfully!');
        // Clear the moveset data in local storage after sending it to the server

      } else {
        console.log('Error sending moveset data to the database:', response.status);
      }
    })
    .catch(error => {
      console.error('Error sending moveset data to the database:', error);
    });
}


function clearLocalStorageExceptPlayerId() {
  // clears local storage except for playerID, condition, and trial so that it is kept for further trials; condition array is reduced until it is empty so that all participants participate in all conditions
   const playerId = localStorage.getItem('playerId'); 
   const playerCondition = JSON.parse(localStorage.getItem('condition'));
   const playerTrial = JSON.parse(localStorage.getItem('trial'));
   localStorage.clear(); 
   localStorage.setItem('playerId', playerId); 
   localStorage.setItem('condition', JSON.stringify(playerCondition));
   localStorage.setItem('trial', JSON.stringify(playerTrial));
 }
 

function showLevel() {
  levelDisplay.innerHTML = localStorage.getItem('currentLevelNumber')
}



function initialTimePassed() {
  const timeAfterBreak = localStorage.getItem('timeAfterBreak'); // If break already taken, do not prompt another break. Else check if time has passed for break. 
  if (timeAfterBreak) {

    return false; 
  }
 
  return new Date() - new Date(localStorage.getItem('timeAtInitialize')) > 10000;
}

function totalTimePassed() {
  const timeAfterBreak = localStorage.getItem('timeAfterBreak');
  if (timeAfterBreak === null || timeAfterBreak === undefined) {
    return false; 
  }


  return new Date() - new Date(timeAfterBreak) > 10000;
}

function generateNewLevel() {
  loadAndRenderLevel(currentLevel);
  storeLevelNumber();
  showLevel();
  recordTimeAtInitialize();
}

function determineNextLevel() {
  const currentLevelNumber = localStorage.getItem('currentLevelNumber');
  if (parseInt(currentLevelNumber)>3) {
    const trials = JSON.parse(localStorage.getItem('trial'));
    currentLevel = `levels/level${trials[0]}.txt`;
    trials.shift();
    localStorage.setItem('trial', JSON.stringify(trials));
  } else {
    currentLevel = `levels/level${parseInt(localStorage.getItem('currentLevelNumber'))+1}.txt`
  }

}

function skipLevel() {
  const playerId = localStorage.getItem('playerId');
  const currentLevelNumber = localStorage.getItem('currentLevelNumber');
  determineNextLevel();
  localStorage.setItem('completedLevel', "0");
  recordUserCompletion(playerId);
  pushMovesetsToDatabase(playerId, currentLevelNumber);
  clearLocalStorageExceptPlayerId();
  removeCondition();
  generateNewLevel();
}

function timeCheck() {
  // check if in a practice round. If not, assign participant to break task or move to next level
  const currentLevelNumber = parseInt(localStorage.getItem('currentLevelNumber'));
  if (currentLevelNumber < 5) return
  if (totalTimePassed()) {
    showPopup("Thank you for your effort on this puzzle. Please proceed to the next puzzle. Press confirm to start.","nextlevel");
    
  } else if (initialTimePassed()) {
    showPopup("You will now begin a short break. You will return to this puzzle later. Press confirm to start your break.","break");
    
  }
}

function showPopup(message, type) {
  const overlay = document.getElementById('overlay');
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  const confirmButton = document.getElementById('confirm-button');
  overlay.style.display = 'block';
  popup.style.display = 'block';
  popupMessage.innerHTML = message;


  if (type === 'break') {
    confirmButton.addEventListener('click', handleBreakClick);
  }

  if (type === 'nextlevel') {
    confirmButton.addEventListener('click', handleNextLevelClick);
  }

  function handleBreakClick() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
    confirmButton.removeEventListener('click', handleBreakClick);
    confirmButton.removeEventListener('click', handleNextLevelClick);
    const gameState = {
      currentLevel: currentLevel,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    recordTimeBeforeBreak();
    redirectToBreak();
  }

  function handleNextLevelClick() {
    confirmButton.removeEventListener('click', handleBreakClick);
    confirmButton.removeEventListener('click', handleNextLevelClick);
    overlay.style.display = 'none';
    popup.style.display = 'none';
    skipLevel();
  }
}


// redirects participants to the corresponding type of break condition
function redirectToBreak() {
  participantCondition = JSON.parse(localStorage.getItem('condition'))[0];
  window.location.href =  `break-${participantCondition}.html`;
}
 
// participant is in each condition until no more conditions remain. At that point they finish with a survey. 
function removeCondition() {
  const participantCondition = JSON.parse(localStorage.getItem('condition'));
  participantCondition.shift();
  if (participantCondition === '[]') redirectToSummary();
  localStorage.setItem('condition',JSON.stringify(participantCondition));
}



 

