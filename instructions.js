// counterbalanced conditions. the 4 '0' are the initial practice trials that everyone does
const fullscreenButton = document.getElementById('fullscreenButton')
const conditions = [
    [0, 0, 0, 0, 1, 2, 3],
    [0, 0, 0, 0, 1, 3, 2],
    [0, 0, 0, 0, 2, 3, 1],
    [0, 0, 0, 0, 2, 1, 3],
    [0, 0, 0, 0, 3, 1, 2],
    [0, 0, 0, 0, 3, 2, 1],
];
//Get Prolific values from URL parameters
const prolificPID = new URLSearchParams(window.location.search).get('PROLIFIC_PID');
const studyID = new URLSearchParams(window.location.search).get('STUDY_ID');
const sessionID = new URLSearchParams(window.location.search).get('SESSION_ID');
const trials = [
    [5,6,7],
    [5,7,6],
    [6,5,7],
    [6,7,5],
    [7,5,6],
    [7,6,5]
]


const instructions = [
    "<div style='text-align: center'><img src='images/unimelb2.png' width='250px' alt='university of melbourne logo'></div> <h1>Faculty of Engineering and Technology</h1><h1>Computing and Information Systems</h1><br><hr><h1>Project ID: 28212 - Effects of Hedonic Information System Breaks on Problem Solving</h1><br><h3>Introduction</h3> Thank you for your interest in participating in this research project. The following few pages will provide you with information about the project, so that you can decide if you would like to take part in this research. Please take the time to read this information carefully. At the end of the study you will be redirected to Prolific. As long as you remain active during this study, you will be paid according to the rate specified on Prolific.  <br><br><h3>What is the research about?</h3> The aim of the study is to investigate problem solving behavior for insight problems. We are interested in how cognition plays a role in problem solving. We are also interested in contextual factors that affect online problem solving, such as the effect of breaks. <br><br> <h3>What will I be asked to do?</h3> You will be asked to solve several puzzles of varying difficulty. Your behavior, including keystrokes and duration taken for each puzzle, will be recorded. Some demographic items and survey items will be recorded, such as your familiarity with technology and puzzle games. The entire study may take up to a maximum of 35 minutes, although on average it should take around 20 minutes to complete. <br><br> <h3>What are the possible risks?</h3> It is unlikely that you will be exposed to any physical or psychological distress by participating in this project. You may experience moments of frustration or arousal while working on the problems. However, we emphasize that we are interested in problem solving behavior, not necessarily the completion of the problems. You will still be paid regardless of how many problems you solve. <br><br> <h3>What are the possible benefits?</h3> The research aims to increase understanding of factors that promote problem solving. This will have implications for how to improve human problem solving. We cannot guarantee any specific individual benefit from the project. <br><br> <h3>What if I want to withdraw from the research?</h3> Your participation is voluntary. You are free to stop participation at any point by simply closing the browser. Your data will not be used if you withdraw early from the study.<br><br> <h3>Privacy, Confidentiality, and Disclosure of Information</h3>Data collected as part of this project will not be associated with any identifying information. A randomly generated ID will automatically be assigned and used to group your data. We have no way of tracing the ID or your Prolific ID to your personal identity. In any publication, information will be provided in a way so that no participants can be identified. Only group data will be shown.<br><br>All information gathered from participants will be kept securely. Electronic data will be password protected and stored on a database server. Only the primary researcher will have access to this data. The data will not include any personal identifying information. After completing the project, the data will be securely stored for five years at the University of Melbourne, after which the data will be destroyed. <br><br><h3>Results of the Project</h3>The results of the project will likely be presented as part of a PhD thesis. It is also possible that the finding will be disseminated in a peer-reviewed journal and/or conference presentations.<br><br><h3>For further information</h3> <p>University of Melbourne, Department of Computing and Information Systems</p><p>Name of Investigator(s):</p>PhD student Mr. Mike Zhuang (mike.zhuang@unimelb.edu.au)<br>Co-Supervisor Professor Ofir Turel (oturel@unimelb.edu.au)<br>Co Supervisor Dr. Shaanan Cohney (cohneys@unimelb.edu.au)<br><br>This project has human research ethics approval from The University of Melbourne Project ID: 28212. If you have any concerns or complaints about the conduct of this research project, which you do not wish to discuss with the research team, you should contact the Research Integrity Administrator, Office of Research Ethics and Integrity, University of Melbourne, VIC 3010. Tel: +61 3 8344 1376 or Email: research-integrity@unimelb.edu.au. All complaints will be treated confidentially. In any correspondence please provide the name of the research team and/or the name or ethics ID number of the research project. <br><br>A PDF copy of the plain language statement can be downloaded by clicking the link below:<br> <a href='documents/plain-language-statement.pdf' download='plain-language-statement.pdf'>Plain Langauge Statement Download</a> <br><br>Thank you for considering participating in this research. Please click 'Continue' to proceed.",
 
    "<div style='text-align: center'><img src='images/unimelb2.png' width='250px' alt='university of melbourne logo'></div> <br><h1>Consent for persons participating in a research project</h1> <hr><br><br>  <ol><li>I consent to participate in this project. The purpose of this research is to investigate problem solving behavior. I have been provided with a plain language statement.</li><li>I understand that this project is for research purposes only.</li><li>I understand that my keystrokes (movement keys, restart and undo key) are recorded during the experiment. </li><li>I understand that there are risks involved in participating in this research project. Specifically, that I may become frustrated while working on some difficult problems.  </li><li>I understand that my participation is voluntary and that I am free to withdraw from the project at any time without explanation or prejudice and to withdraw any unprocessed data I have provided.</li><li> I understand that the data from this research will be stored at the University of Melbourne and will be stored 5 years following the project completion. The collected data will be destroyed 5 years after the project completion.</li><li>I have been informed that the confidentiality of the information I provide will be safeguarded subject to any legal requirements; my data will be password protected and accessible only by the named researchers.</li><li>I am 18 years old or above.</li></ol><br><br><h1>By clicking continue you acknowledge that you agree to the above.",

    "You will now be asked to complete a series of Sokoban puzzles. These are classic problems where you push boxes around a warehouse towards storage locations.<br><div style='text-align:center'><img src='images/sokoban.gif' alt='Animated GIF'></div><br> It is natural to have trouble completing some puzzles. Please continue to work on the puzzles even if you find yourself stuck on them. You can use the <b>r</b> key to restart and the <b>u</b> key to undo a move as many times as you need.</br> <br>During the study, you may be given short breaks after working on a puzzle for a few minutes. During these breaks please follow the instructions on the screen and remain on the computer. Please enable computer audio for use on some tasks. You will be automatically directed back to the puzzles after a few minutes.<br><br> It is important that you do not press use the back and refresh functions on your browser while you are working on this study. You are free to exit this study at any time by simply closing your browser. If you go back pages, refresh the page, or exit the study, your data will not be used and you will not be compensated for your time.<br><br>Your compensation does not increase if you solve the puzzles. We are only interested in individual problem solving behavior. As such, please do not seek external help in order to complete the puzzles. You will be paid the full amount as long as you are working on the puzzles. Please remain active during this study and do not go idle.  </h1>",

  

    "<h1>You will now answer a few questions to confirm your understanding of the task. You will be allowed to review the instructions if you are unsure of any questions. Press continue to start. </h1> "

];

let currentInstructionIndex = 0;
const attentionCheckForm = document.getElementById("attentionCheckForm");
const instructionText = document.getElementById("instructionText");
const continueButton = document.getElementById("continueButton");
const backButton = document.getElementById('backButton');
const questions = [
    { name: "question1", correctAnswer: "true" },
    { name: "question2", correctAnswer: "true" },
    { name: "question3", correctAnswer: "false" },
    { name: "question4", correctAnswer: "false" }
];



document.addEventListener("DOMContentLoaded", function () {

    function handleContinueClick() {
        currentInstructionIndex++;
        updateInstructionText();
        if (currentInstructionIndex === 1) backButton.style.display = 'inline';
        if (currentInstructionIndex === 0) backButton.style.display = 'none';

    }

    function handleBackClick() {
        // Check if there's a previous instruction to go back to
    
            currentInstructionIndex--;
            updateInstructionText();
            if (currentInstructionIndex === 1) backButton.style.display = 'inline';
            if (currentInstructionIndex === 0) backButton.style.display = 'none';
        
    }

    continueButton.addEventListener("click", handleContinueClick);
    backButton.addEventListener("click", handleBackClick);
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

            alert("You will now start working on the puzzles. Please enable the volume on your device for later parts of the study if you haven't already.");
            window.location.href='main-experiment.html';
   
        } else {

            alert("Incorrect answers. Please carefully review the instructions.");
            attentionCheckForm.reset();
            currentInstructionIndex = 2;
            updateInstructionText();
            attentionCheckForm.style.display = "none";
            continueButton.style.display = "inline-block";

            // Add code to redirect to the beginning of your instructions or experiment here
        }
    });
});

function updateInstructionText() {
    if (currentInstructionIndex < instructions.length) {
        instructionText.innerHTML = instructions[currentInstructionIndex];
    } else {
        // Show the attention check form
        continueButton.style.display = "none";
        backButton.style.display = 'none';
        attentionCheckForm.style.display = "block";
        
    }
}



function generateUniqueID() {


    // Assign participant to one of the counterbalanced conditions and store it in localStorage
    const participantCondition = conditions[Math.floor(Math.random() * conditions.length)];
    localStorage.setItem('condition', JSON.stringify(participantCondition));

    // Randomize puzzle order
    const trialOrder = trials[Math.floor(Math.random() * conditions.length)];
    localStorage.setItem('trial', JSON.stringify(trialOrder));

    // generate a random number for the participant ID
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}${randomNum}`;
}




function getplayerId() {
    localStorage.clear();
    // Check if the unique ID is already stored in localStorage
    let playerId = localStorage.getItem("playerId");
    if (!playerId) {
        // If the unique ID doesn't exist, generate a new one and store it in localStorage
        playerId = generateUniqueID();
        localStorage.setItem("playerId", playerId);
        // Store Prolific IDs
        localStorage.setItem('prolificPID', prolificPID);
        localStorage.setItem('studyID', studyID);
        localStorage.setItem('sessionID', sessionID);
    }
    return playerId;
}

window.onload = function() {
    var hasTouchScreen = false;

    if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
        var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches;
        } else if ('orientation' in window) {
            hasTouchScreen = true; // deprecated, but good fallback
        } else {
            // Only as a last resort, fall back to user agent sniffing
            var UA = navigator.userAgent;
            hasTouchScreen = (
                /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
                /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
            );
        }
    }

    if (hasTouchScreen) {
        document.getElementById('web-popup').style.display = 'block';
        continueButton.style.display = 'none';
    }
};






getplayerId();

