const form = document.getElementById("returnForm");
const digitalMediaInput = document.getElementsByName("digitalMedia");
const mediaTaskInput = document.getElementById("mediaTask");
let timeAfterBreak;
var isRedirecting = false;


// Event listener for form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Get the form values
    const mw1 = document.querySelector('input[name="mw1"]:checked').value;
    const mw2 = document.querySelector('input[name="mw2"]:checked').value;
    const mw3 = document.querySelector('input[name="mw3"]:checked').value;
    const f1 = document.querySelector('input[name="f1"]:checked').value;   
    const f2 = document.querySelector('input[name="f2"]:checked').value;   
    const f3 = document.querySelector('input[name="f3"]:checked').value;   
    const e1 = document.querySelector('input[name="e1"]:checked').value;
    const e2 = document.querySelector('input[name="e2"]:checked').value;
    const e3 = document.querySelector('input[name="e3"]:checked').value;
    const pw = document.querySelector('input[name="pw"]:checked').value;
    const r1 = document.querySelector('input[name="r1"]:checked').value;
    const r2 = document.querySelector('input[name="r2"]:checked').value;
    const r3 = document.querySelector('input[name="r3"]:checked').value;

    // Create the data object to be sent to the server
    const data = {
      mw1: mw1,
      mw2: mw2,
      mw3: mw3,
      f1: f1,
      f2: f2,
      f3: f3,
      e1: e1,
      e2: e2,
      e3: e3,
      pw: pw,
      r1: r1,
      r2: r2,
      r3: r3,
        playerId: localStorage.getItem('playerId'),
        levelNumber: localStorage.getItem('currentLevelNumber')

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
        isRedirecting = true;

        window.location.href = "main-experiment.html";
      })
      .catch(error => {
        console.error('Error submitting survey data:', error);
      });
  });
  


  function recordTimeAfterBreak() {
    localStorage.setItem('timeAfterBreak', new Date().toISOString());
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