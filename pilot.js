const TILE_SIZE = 50; // Define the size of each tile on the canvas
const BROWN_COLOR = "#D2B48C"; // Light brown color for background
const GREEN_COLOR = "#008000"; // Green color for target tiles
const wallSprite = new Image();
const boxSprite = new Image();
const playerSprite = new Image();
const spriteSize = TILE_SIZE * 0.8;
const loadingScreen = document.getElementById("loadingScreen");
const levelDisplay = document.getElementById("currentLevel");
const skipButton = document.getElementById('skip');
let moveset = [];
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
let currentLevel = 'levels/level1.txt';
let levelArray; // Define levelArray as a global variable to access it across functions
let gameStateHistory = []; // Array to store the game state history
let timeAtInitialize;
let timeAtWin;
wallSprite.src = "images/wall.jpg";
boxSprite.src = "images/box.png";
playerSprite.src = "images/player.png"
const xOffset = (TILE_SIZE - spriteSize) / 2;
const yOffset = (TILE_SIZE - spriteSize) / 2;

function loadLevelData(filename) {
    return fetch(filename)
        .then(response => response.text())
        .then(data => data.trim());
}

function parseLevelData(levelData) {
    const lines = levelData.split("\n");
    const levelArray = lines.map(line => line.split(""));
    return levelArray;

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
}

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

function canPushBox(x, y, dx, dy) {
    const targetX = x + dx;
    const targetY = y + dy;
    const targetCell = levelArray[targetY][targetX];

    // A box can be pushed if the target cell is an empty space or another target tile
    return targetCell === " " || targetCell === ".";
}

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
        skipButton.style.display = 'none'
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
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 2000)
}

loadLevelData(currentLevel)
    .then(levelData => {
        levelArray = parseLevelData(levelData);
        // Get the player's starting position
        const playerStartPosition = findPlayerStartingPosition(levelArray);
        playerX = playerStartPosition.x;
        playerY = playerStartPosition.y;

        // Render the level on the canvas
        initializeGame();
    })
    .catch(error => {
        console.error("Error loading or parsing the level data:", error);
    });

function resetLevel() {
    loadLevelData(currentLevel)
        .then(levelData => {

            levelArray = parseLevelData(levelData);
            const playerStartPosition = findPlayerStartingPosition(levelArray);
            const stuck = localStorage.getItem('stuckOnLevel')
            playerX = playerStartPosition.x;
            playerY = playerStartPosition.y;
            saveMoveset(moveset);
            clearMoveset();
            gameStateHistory = [];
            if(!stuck && timePassed()) {checkStuck()};
            showSkip();
            renderLevel(levelArray);
        })
        .catch(error => {
            console.error("Error loading or parsing the level data:", error);
        });
}

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

function checkWinCondition() {
    for (let row = 0; row < levelArray.length; row++) {
        for (let col = 0; col < levelArray[row].length; col++) {
            if (levelArray[row][col] === "$") {
                return false; // There is still at least one box left, so the player has not won
            }
        }
    }
    const playerId = localStorage.getItem('playerId');
    recordTimeAtWin();
    currentLevel = `levels/level${parseInt(localStorage.getItem('currentLevelNumber'))+1}.txt`
    saveMoveset(moveset);
    localStorage.setItem('skippedLevel', "False");
    recordUserCompletion(playerId);
    clearLocalStorageExceptPlayerId();
    generateNewLevel();
}

function generateNewLevel() {
    loadAndRenderLevel(currentLevel);
    showLevel();
    clearMoveset();
    storeLevelNumber();
    recordTimeAtInitialize();
    
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
                levelArray = gameState.levelArray;
                gameStateHistory = gameState.gameStateHistory;
                moveset = gameState.moveset;
                // Render the level with the restored game state
                renderLevel(levelArray);
            } else {
                // No stored game state, load a random level
                loadAndRenderLevel('levels/level1.txt');
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

function clearMoveset() {
    moveset = [];
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
    const url = 'https://sokoban-badc101a491f.herokuapp.com/complete-level-pilot';
    const data = {
        playerId: playerId,
        durationToBeatGame: localStorage.getItem('durationToBeatGame'),
        levelNumber: localStorage.getItem('currentLevelNumber'),
        checkStuck: localStorage.getItem('stuckOnLevel'),
        checkSkip: localStorage.getItem('skippedLevel')
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

function recordTimeAtWin() {
    timeAtWin = getTimestamp();
    localStorage.setItem('timeAtWin', timeAtWin);
    timeAtInitialize = localStorage.getItem('timeAtInitialize');
    // Calculate time intervals
    const durationToBeatGame = new Date(timeAtWin) - new Date(timeAtInitialize);
 
    // Store time intervals in localStorage
    localStorage.setItem('durationToBeatGame', durationToBeatGame);
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
}

function clearLocalStorageExceptPlayerId() {
    const playerId = localStorage.getItem('playerId'); // Get the playerId before clearing
    localStorage.clear(); // Clear all items in localStorage
    localStorage.setItem('playerId', playerId); // Restore the playerId after clearing
}

function showLevel() {
    levelDisplay.innerHTML = localStorage.getItem('currentLevelNumber')
}



  function checkStuck() {
    document.getElementById('popupContainer').style.display = 'block';
  }

  // Function to hide the popup
  function hidePopup() {
    document.getElementById('popupContainer').style.display = 'none';
  }

  // Function to handle the user's answer
  function handleAnswer(answer) {
    // Store the answer in localStorage
    localStorage.setItem('stuckOnLevel', answer);

    // Close the popup
    hidePopup();
  }

  // Event listener for the "Yes" button
  document.getElementById('yesButton').addEventListener('click', function () {
    handleAnswer('Yes');
  });

  // Event listener for the "No" button
  document.getElementById('noButton').addEventListener('click', function () {
    handleAnswer('No');
  });


  function timePassed() {
  return new Date() - new Date(localStorage.getItem('timeAtInitialize')) > 300000;
}

function showSkip() {
    if(new Date() - new Date(localStorage.getItem('timeAtInitialize')) > 600000) {
        skipButton.style.display = 'block'
    }

}

skipButton.addEventListener('click', function() {
    const playerId = localStorage.getItem('playerId');
    recordTimeAtWin();
    currentLevel = `levels/level${parseInt(localStorage.getItem('currentLevelNumber'))+1}.txt`
    saveMoveset(moveset);
    recordUserCompletion(playerId);
    localStorage.setItem('skippedLevel', "True");
    clearLocalStorageExceptPlayerId();
    generateNewLevel();
})