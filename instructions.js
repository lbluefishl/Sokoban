const instructions = [
    "<h1>Introduction</h1> Thank you for your interest in participating in this research project. The following few pages will provide you with further information about the project, so that you can decide if you would like to take part in this research. Please take the time to read this information carefully. <br><br><h1>What is the research about?</h1> The aim of the study is to investigate problem solving behavior for insight problems. We are interested in how cognition plays a role in problem solving. We are also interested in contextual factors that affect online problem solving, such as the effect of breaks. <br><br> <h1>What will I be asked to do?</h1> You will be asked to solve several puzzles of varying difficulty. Your behavior, including keystrokes and duration taken for each puzzle, will be recorded. Some demographic items and survey items will be recorded, such as your familiarity with technology and puzzle games. The entire study may take up to a maximum of 40 minutes, although on average it should take around 20 minutes to complete. <br><br> <h1>What are the possible risks?</h1> It is unlikely that you will be exposed to any physical or psychological distress by participating in this project. You may experience moments of frustration or arousal while working on the problems. However, we emphasize that we are interested in problem solving behavior, not necessarily the completion of the problems. You will still earn the maximum participation fee regardless of how many problems you solve. <br><br> <h1>What are the possible benefits?</h1> The research aims to increase understanding of factors that promote problem solving. This will have implications for how to improve human problem solving. We cannot guarantee any specific individual benefit from the project. <br><br> <h1>What if I want to withdraw from the research?</h1> Your participation is voluntary. You are free to stop participation at any point. Your data will not be used if you withdraw early from the study.<br><br> <h1>Privacy, Confidentiality, and Disclosure of Information</h1>Data collected as part of this project will not be associated with any identifying information. A randomly generated ID will automatically be assigned and used to group your data. We have no way of tracing the ID to your personal identity. In any publication, information will be provided in a way so that no participants can be identified. Only group data will be shown.<br><br>All information gathered from participants will be kept securely. Electronic data will be password protected and stored on a database server. Only the primary researcher will have access to this data. The data will not include any personal identifying information. After completing the project, the data will be securely stored for five years at the University of Melbourne, after which the data will be destroyed. <br><br><h1>Results of the Project</h1>The results of the project will likely be presented as part of a PhD thesis. It is also possible that the finding will be disseminated in a peer-reviewed journal and/or conference presentations.<br><br><h1>For further information</h1> <p>University of Melbourne, Department of Computing and Information Systems</p><p>Name of Investigator(s):</p><p>Mr. Mike Zhuang (mike.zhuang@unimelb.edu.au)</p><p>Dr. Ofir Turel (oturel@unimelb.edu.au)</p><p>Dr. Shaanan Cohney (cohneys@unimelb.edu.au)</p><br><br> Thank you for considering participating in this research. Please click 'Continue' to proceed.",

    "<div style='text-align: center'><img src='images/unimelb.png' width='250px' alt='university of melbourne logo'></div> <h1>Department of Computing and Information Systems</h1><br><h1>Consent for persons participating in a research project</h1> <br><br> <p>Name of Investigator(s): </p><p>Mr. Mike Zhuang (zhuang.m@unimelb.edu.au)</p><p>Dr. Ofir Turel (oturel@unimelb.edu.au)</p><p>Dr. Shaanan Cohney (cohneys@unimelb.edu.au)</p> <ol><li>I consent to participate in this project. The purpose of this research is to investigate problem solving behavior. I have been provided with a plain language statement.</li><li>I understand that this project is for research purposes only.</li><li>I understand that my keystrokes (movement keys, restart and undo key) are recorded during the experiment. </li><li>I understand that there are risks involved in participating in this research project. Specifically, that I may become frustrated while working on some difficult problems.  </li><li>I understand that my participation is voluntary and that I am free to withdraw from the project at any time without explanation or prejudice and to withdraw any unprocessed data I have provided.</li><li> I understand that the data from this research will be stored at the University of Melbourne and will be stored 5 years following the project completion. The collected data will be destroyed 5 years after the project completion.</li><li>I have been informed that the confidentiality of the information I provide will be safeguarded subject to any legal requirements; my data will be password protected and accessible only by the named researchers.</li><li>I am 18 years old or above.</li></ol><br><br><h1>By clicking continue you acknowledge that you agree to the above.",

    "You will now be asked to complete a series of Sokoban puzzles. These are classic problems where you push boxes around a warehouse, trying to get them to storage locations.<br><br> It is natural to have trouble completing some puzzlse. Please continue to work on the puzzles even if you find yourself stuck on them.</br> <br>During the study, you may be given short breaks. You are free to do anything during the break, but please make sure to return to the task after a few minutes. You do not need to stay at the computer. You will be asked a few questions after returning from a break.</h1>",

    "We are only interested in individual problem solving behavior. As such, please do not seek external help in order to complete the puzzles. You will still be paid the full amount as long as you are working on the puzzles.",

    "Please answer the following questions to confirm your understanding of the task."

];

let currentInstructionIndex = 0;
const attentionCheckForm = document.getElementById("attentionCheckForm");
const instructionText = document.getElementById("instructionText");
const continueButton = document.getElementById("continueButton");
const questions = [
    { name: "question1", correctAnswer: "true" },
    { name: "question2", correctAnswer: "true" },
    { name: "question3", correctAnswer: "false" }
];



document.addEventListener("DOMContentLoaded", function () {
 
    function handleContinueClick() {
        currentInstructionIndex++;
        updateInstructionText();
    }
    
    continueButton.addEventListener("click", handleContinueClick);

    // Initialize with the first instruction
    updateInstructionText();
});


document.addEventListener("DOMContentLoaded", function () {

    attentionCheckForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let correctAnswers = 0;

        for (const question of questions) {
            const selectedAnswer = document.querySelector(`input[name="${question.name}"]:checked`);
            if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                correctAnswers++;
            }
        }

        if (correctAnswers === questions.length) {
            // All questions answered correctly, proceed
            alert("You will now start working on the puzzles.");

            checkPlayerIdAndRedirect()
            
            // Add code to redirect to your experiment here
        } else {
            // Incorrect answers, redirect to the beginning
            alert("Incorrect answers. Please carefully review the instructions.");
            currentInstructionIndex = 0;
            updateInstructionText();
            attentionCheckForm.style.display = "none";
            continueButton.style.display = "block";

            // Add code to redirect to the beginning of your instructions or experiment here
        }
    });
});

function updateInstructionText() {
    if (currentInstructionIndex < instructions.length) {
        instructionText.innerHTML = instructions[currentInstructionIndex];
    } else {
        // Show the attention check form
        continueButton.style.display = "none"
        attentionCheckForm.style.display = "block";
    }
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

// Call the function to check and redirect

