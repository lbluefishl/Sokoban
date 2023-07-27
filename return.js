const form = document.getElementById("returnForm");
const digitalMediaInput = document.getElementsByName("digitalMedia");
const mediaTaskInput = document.getElementById("mediaTask");



// Event listener for form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Get the form values
    const digitalMediaValue = document.querySelector('input[name="digitalMedia"]:checked').value;
    const mediaTaskValue = document.querySelector('input[name="mediaTask"]:checked').value;
    const mindWanderValue = document.querySelector('input[name="mindWander"]:checked').value;
  
    const gameState = JSON.parse(localStorage.getItem('gameState'));
    const currentLevel = gameState.currentLevel;
    const currentLevelNumber = parseInt(currentLevel.split("level")[2].split(".txt")[0]);

    // Create the data object to be sent to the server
    const data = {
        digitalMedia: digitalMediaValue,
        mediaTask: mediaTaskValue,
        mindWander: mindWanderValue,
        playerId: localStorage.getItem('playerId'),
        levelNumber: currentLevelNumber,
      };
    
  
    // Send the data to the server using fetch
    fetch('https://sokoban-badc101a491f.herokuapp.com/submit-survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          console.log('Survey data submitted successfully!');
        } else {
          console.log('Error submitting survey data:', response.status);
        }
        // Redirect back to index.html after form submission
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error('Error submitting survey data:', error);
        // Redirect back to index.html even if there's an error
        window.location.href = "index.html";
      });
  });
  




  // Event listener to show the media task input field when 'yes' is selected
  for (let i = 0; i < digitalMediaInput.length; i++) {
    digitalMediaInput[i].addEventListener("click", function () {
      mediaTaskInput.style.display = digitalMediaInput[i].value === "yes" ? "block" : "none";
    });
  }

