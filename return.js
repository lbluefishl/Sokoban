const form = document.getElementById("returnForm");
const digitalMediaInput = document.getElementsByName("digitalMedia");
const mediaTaskInput = document.getElementById("mediaTask");
let timeAfterBreak;


// Event listener for form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Get the form values
    const enjoymentValue = document.querySelector('input[name="enjoyment"]:checked').value;   
    const relaxationValue = document.querySelector('input[name="relaxation"]:checked').value;
    const absorptionValue = document.querySelector('input[name="absorption"]:checked').value;
    const puzzleWorkValue = document.querySelector('input[name="puzzleWork"]:checked').value;
    const mindWanderValue = document.querySelector('input[name="mindWander"]:checked').value;
    // Create the data object to be sent to the server
    const data = {
      enjoyment: enjoymentValue,
      relaxation: relaxationValue,
      absorption: absorptionValue,
      puzzleWork: puzzleWorkValue,
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
        recordTimeAfterBreak();
        window.location.href = "main-experiment.html";
      })
      .catch(error => {
        console.error('Error submitting survey data:', error);
      });
  });
  


  function recordTimeAfterBreak() {
    localStorage.setItem('timeAfterBreak', new Date().toISOString());
  }

