// Get the number container and choice buttons
const numberContainer = document.getElementById('number-container');
const oddButton = document.getElementById('odd-button');
const evenButton = document.getElementById('even-button');
const continueButton = document.getElementById('continueButton');
const overlay = document.getElementById('overlay');
var correct = 0;
var incorrect = 0;
var isRedirecting = false;

continueButton.addEventListener('click', () => {
  showNumber();
  overlay.style.display ='none';
  oddButton.style.display ='inline';
  evenButton.style.display ='inline';
}

);

// Function to generate a random number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to display a new number on the screen
function showNumber() {
  const number = getRandomNumber(1, 9); // Generate a random number
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
  }, getRandomNumber(5000, 10000));
}

// Redirect the page after three minutes
setTimeout(() => {
localStorage.setItem('correct',correct);
localStorage.setItem('incorrect',incorrect);
isRedirecting = true;
  window.location.href = 'return.html';
}, 180000); 


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