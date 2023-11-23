// Get the number container and choice buttons
const numberContainer = document.getElementById('number-container');
const oddButton = document.getElementById('odd-button');
const evenButton = document.getElementById('even-button');
var correct = 0;
var incorrect = 0;

showNumber();

// Function to generate a random number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to display a new number on the screen
function showNumber() {
  const number = getRandomNumber(1, 1000); // Generate a random number
  numberContainer.textContent = number; // Display the number
}

// Event listener for the choice buttons
oddButton.addEventListener('click', () => handleChoice(true));
evenButton.addEventListener('click', () => handleChoice(false));

function handleChoice(userChoosesOdd) {
  const number = parseInt(numberContainer.textContent);

  // Check if the user's choice is correct
  const isCorrect = (number % 2 === 1 && userChoosesOdd) || (number % 2 === 0 && !userChoosesOdd);

  if (isCorrect) {
    correct++;
  } else {
    incorrect++;
  }

  // Hide the number container and choice buttons
  numberContainer.textContent = '';
  oddButton.style.display = 'none';
  evenButton.style.display = 'none';


  setTimeout(() => {
    numberContainer.textContent = '';
    oddButton.style.display = 'inline-block';
    evenButton.style.display = 'inline-block';
    showNumber();
  }, getRandomNumber(2000, 5000));
}

// Redirect the page after one minute
setTimeout(() => {
localStorage.setItem('correct',correct);
localStorage.setItem('incorrect',incorrect);
  window.location.href = 'return.html';
}, 60000); // 60000 milliseconds = 1 minute
