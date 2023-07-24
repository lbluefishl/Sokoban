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
      if (levelArray[y][x] === "+" || levelArray[y][x]==="@") {
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
    } else { levelArray[targetY][targetX] = "+"; 
  }// Move to a target tile
    

    if (boxTarget === " " && (targetCell === "$" || targetCell === "*")) {
      levelArray[targetY + dy][targetX + dx] = "$"
    } else if(boxTarget === "." && (targetCell === "$" || targetCell === "*"))
    {
      levelArray[targetY + dy][targetX + dx] = "*"
    }
    // move box

    // Update the cell the player was originally in if it was a target tile
    if (playerCell === "+") {
      levelArray[playerPos.y][playerPos.x] = "."; // Change player's previous cell to regular target tile
    } else {
      levelArray[playerPos.y][playerPos.x] = " ";
    }

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

// Assuming you have the Canvas element with the id "gameCanvas" in your HTML

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
"level11.txt",
"level12.txt",
"level13.txt",
"level14.txt",
"level15.txt",
"level16.txt",
"level17.txt",
"level18.txt",
"level19.txt",
"level20.txt",
"level21.txt",
"level22.txt",
"level23.txt",
"level24.txt",
"level25.txt",
"level26.txt",
"level27.txt",
"level28.txt",
"level29.txt",
"level30.txt"
];


const newLevelButton = document.getElementById('newLevel');
const TILE_SIZE = 50; // Define the size of each tile on the canvas
const BROWN_COLOR = "#D2B48C"; // Light brown color for background
const GREEN_COLOR = "#008000"; // Green color for target tiles
const wallSprite = new Image();
const boxSprite = new Image();
const playerSprite = new Image();
const spriteSize = TILE_SIZE * 0.8;
let currentLevel = `levels/level${Math.floor(Math.random() * levelFiles.length)}.txt`

wallSprite.src = "images/wall.jpg";
boxSprite.src = "images/box.png";
playerSprite.src = "images/player.png"

const xOffset = (TILE_SIZE - spriteSize) / 2;
const yOffset = (TILE_SIZE - spriteSize) / 2;

function getRandomLevelIndex() {
  return Math.floor(Math.random() * levelFiles.length);
}

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

// Event listener for the "New Level" button
newLevelButton.addEventListener("click", function () {
  let randomLevelIndex = getRandomLevelIndex();
  while (levelFiles[randomLevelIndex] === currentLevel) {
    randomLevelIndex = getRandomLevelIndex();
  }
  currentLevel = `levels/${levelFiles[randomLevelIndex]}`;
  loadAndRenderLevel(currentLevel);
});


function renderLevel(levelArray) {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Set the canvas size based on the level data dimensions
  canvas.width = levelArray[0].length * TILE_SIZE;
  canvas.height = levelArray.length * TILE_SIZE;

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
}

// Load and parse the level data
loadLevelData(currentLevel)
  .then(levelData => {
    levelArray = parseLevelData(levelData);
    
    // Get the player's starting position
    const playerStartPosition = findPlayerStartingPosition(levelArray);
    playerX = playerStartPosition.x;
    playerY = playerStartPosition.y;

    // Render the level on the canvas
    renderLevel(levelArray);
  })
  .catch(error => {
    console.error("Error loading or parsing the level data:", error);
  });


  // Function to reset the level to its initial state
function resetLevel() {
  loadLevelData(currentLevel)
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

// Event listener to detect "R" key press for restarting the level
document.addEventListener("keydown", event => {
  if (event.key === "r" || event.key === "R") {
    resetLevel();
  }
});

let levelArray; // Define levelArray as a global variable to access it across functions
let gameStateHistory = []; // Array to store the game state history

function undoLastMove() {
  // Check if there's a previous state in the history
  if (gameStateHistory.length > 0) {
    // Pop the last state from the history and set it as the current state
    levelArray = gameStateHistory.pop();

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
  redirectToSummary();
}

function redirectToSummary() {
  alert("Congrats! You win.");
    window.location.href = "summary.html";
}


