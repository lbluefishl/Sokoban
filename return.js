const form = document.getElementById("returnForm");
const digitalMediaInput = document.getElementsByName("digitalMedia");
const mediaTaskInput = document.getElementById("mediaTask");
let timeAfterBreak;


// Event listener for form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Get the form values
    const digitalMediaValue = document.querySelector('input[name="digitalMedia"]:checked').value;
    const mediaTaskValue = digitalMediaValue === "yes" ? document.querySelector('input[name="mediaTask"]:checked').value : "";
    const mindWanderValue = document.querySelector('input[name="mindWander"]:checked').value;
  

    // Create the data object to be sent to the server
    const data = {
        digitalMedia: digitalMediaValue,
        mediaTask: mediaTaskValue,
        mindWander: mindWanderValue,
        playerId: localStorage.getItem('playerId'),
        levelNumber: localStorage.getItem('currentLevelNumber'),
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
        recordTimeAfterBreak();
        checkPlayerIdAndRedirect();
      })
      .catch(error => {
        console.error('Error submitting survey data:', error);

      });
  });
  




  // Event listener to show the media task input field when 'yes' is selected
  for (let i = 0; i < digitalMediaInput.length; i++) {
    digitalMediaInput[i].addEventListener("click", function () {
      mediaTaskInput.style.display = digitalMediaInput[i].value === "yes" ? "block" : "none";
    });
  }


  function getTimestamp() {
    return new Date().toISOString();
  }

  function recordTimeAfterBreak() {
    timeAfterBreak = getTimestamp();
    localStorage.setItem('timeAfterBreak', timeAfterBreak);
  }


  function checkPlayerIdAndRedirect() {
    // Check if the player ID is stored in localStorage
    const playerId = localStorage.getItem("playerId");

    if (playerId) {
        // Convert the player ID to a number
        const playerIdNumber = parseInt(playerId);

        if (!isNaN(playerIdNumber)) {
            // Check if the player ID is even or odd
            if (playerIdNumber % 2 === 0) {
                // Redirect to the even page
                window.location.href = "main-experiment-break.html";
            } else {
                // Redirect to the odd page
                window.location.href = "main-experiment.html";
            }
        } else {
            // Handle the case where the player ID is not a valid number
            console.error("Invalid player ID in localStorage.");
        }
    } else {
        // Handle the case where the player ID is not stored in localStorage
        console.error("Player ID not found in localStorage.");
    }
}