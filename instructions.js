// counterbalanced conditions. the 4 '0' are the initial practice trials that everyone does
const fullscreenButton = document.getElementById('fullscreenButton')
const conditions = [
    [0, 0, 0, 1, 2, 3],
    [0, 0, 0, 1, 3, 2],
    [0, 0, 0, 2, 3, 1],
    [0, 0, 0, 2, 1, 3],
    [0, 0, 0, 3, 1, 2],
    [0, 0, 0, 3, 2, 1],
];

const nums = [5,6,7,8,11];
const trials = permute(nums);


//Get Prolific values from URL parameters
const prolificPID = new URLSearchParams(window.location.search).get('PROLIFIC_PID');
const studyID = new URLSearchParams(window.location.search).get('STUDY_ID');
const sessionID = new URLSearchParams(window.location.search).get('SESSION_ID');



const instructions = [
    "<div style='text-align: center'><img src='images/unimelb2.png' width='250px' alt='university of melbourne logo'></div> <h1>Department of Computing and Information Systems</h1><br><hr><h1>Project ID: 28212 - Effects of Hedonic Information System Breaks on Problem Solving</h1><br><h3>Introduction</h3> Thank you for your interest in participating in this research project. The following few paragraphs will provide you with information about the project, so that you can decide if you would like to take part in this research. Please take the time to read this information carefully. At the end of the study you will be redirected to Prolific.  <br><br><h3>What is the research about?</h3> The aim of the study is to investigate problem solving behavior for puzzle problems. We are interested in how thinking plays a role in problem solving. We are also interested in other factors that affect online problem solving, such as the effect of breaks.  <br><br> <h3>What will I be asked to do?</h3> You will be asked to solve several puzzles of varying difficulty. Your behavior, including keystrokes and duration taken for each puzzle, will be recorded. You will be asked to complete a few surveys throughout the study.  The entire study may take up to a maximum of 35 minutes, although on average it should take around 20 minutes to complete. <br><br>  <h3>What are the possible benefits?</h3> The research aims to increase understanding of factors that promote problem solving. This will have implications for how to improve human problem solving. We cannot guarantee any specific individual benefit from the project. You will be paid $4 for completing the study and an extra $1 for staying active during the study. If you are inactive for a significant portion of time or leave the website your data will be withdrawn and you will not be paid for the study. <br><br><h3>What are the possible risks?</h3> It is unlikely that you will be exposed to any physical or psychological distress by participating in this project. You may experience moments of frustration or arousal while working on the problems. However, we emphasize that we are interested in problem solving behavior, not necessarily the completion of the problems. You will still be paid regardless of how many problems you solve. <br><br> <h3>Do I have to take part?</h3> No. Participation is completely voluntary. You are able to withdraw at any time. Your data will not be used if you withdraw early from the study.<br><br> <h3>Will I hear about the results of this project?</h3> The results of the project will likely be presented as part of a PhD thesis. It is also possible that the finding will be disseminated in a peer-reviewed journal and/or conference presentations. <br><br> <h3>What will happen to information about me?</h3> Data collected as part of this project will not be associated with any identifying information. A randomly generated ID will automatically be assigned and used to group your data. We have no way of tracing the ID to your personal identity. In any publication, information will be provided in a way so that no participants can be identified. Only group data will be shown.<br><br>All information gathered from participants will be kept securely. Electronic data will be password protected and stored on a database server. Only the primary researcher will have access to this data. The data will not include any personal identifying information. After completing the project, the data will be securely stored for five years at the University of Melbourne, after which the data will be destroyed. <br><br> <h3>Where can I get further information?</h3> If you would like more information about the project, please contact the researchers; <br> PhD student Mr. Mike Zhuang (mike.zhuang@unimelb.edu.au) <br> Co-Supervisor Prof. Ofir Turel (oturel@unimelb.edu.au) <br>Co-Supervisor Dr. Shaanan Cohney (cohneys@unimelb.edu.au) <br><br> <h3>Who can I contact if I have any concerns about the project? </h3> This project has human research ethics approval from The University of Melbourne Project ID#28212. If you have any concerns or complaints about the conduct of this research project, which you do not wish to discuss with the research team, you should contact the Research Integrity Administrator, Office of Research Ethics and Integrity, University of Melbourne, VIC 3010. Tel: +61 3 8344 1376 or Email: <u>research-integrity@unimelb.edu.au</u>. All complaints will be treated confidentially. In any correspondence please provide the name of the research team and/or the name or ethics ID number of the research project.<br><br>A PDF copy of the plain language statement can be downloaded by clicking the link below:<br> <a href='documents/plain-language-statement.pdf' download='plain-language-statement.pdf'>Plain Langauge Statement Download</a> <br><br>Thank you for considering participating in this research. Please click 'Continue' to proceed.",
 
    "<div style='text-align: center'><img src='images/unimelb2.png' width='250px' alt='university of melbourne logo'></div> <br><h1>Consent for persons participating in a research project</h1> <hr><br><br>  <ol><li>I consent to participate in this project, the details of which have been explained to me, and I have been provided with a written plain language statement to keep.</li><li>I understand that the purpose of this research is to investigate problem solving behavior.</li><li> I understand that my participation in this project is for research purposes only.</li><li>I acknowledge that the possible effects of participating in this research project have been explained to my satisfaction.  </li><li>In this project I will be required to work on puzzle and sorting tasks, watch short videos, and complete several surveys.   </li><li>I understand that my participation is voluntary and that I am free to withdraw from this project anytime without explanation or prejudice and to withdraw any unprocessed data that I have provided.</li><li> I understand that the data from this research will be stored at the University of Melbourne and will be destroyed 5 years after publication. </li><li>I have been informed that the confidentiality of the information I provide will be safeguarded subject to any legal requirements; my data will be password protected and accessible only by the named researchers.</li></ol><br><br><h1>By clicking continue you acknowledge that you agree to the above.",

    "<h1>Task Description</h1>You will now be asked to complete a series of Sokoban puzzles. These are classic problems where you push boxes around a warehouse towards storage locations. These problems are difficult for humans and computers. <br><br><div style='text-align:center'><img src='images/sokoban.gif' alt='Animated GIF'></div><br> It is natural to have trouble completing some puzzles. Please continue to work on the puzzles even if you find yourself stuck on them. You can use the <b>r</b> key on the keyboard to restart the level as many times as you need. We are interested in how you try to solve each puzzle, not necessarily whether you complete them or not. <b>Your compensation does not increase if you solve the puzzles</b>. We are only interested in individual problem solving behavior. As such, please do not seek external help in order to complete the puzzles. You will be paid the full amount as long as you are working on the puzzles actively. Please remain active during this study and do not work on other tasks. <u>An additional $1 will be awarded for reasonable effort on the tasks</u>. Failure to stay reasonably active will result in a rejection.<br><br> <b>If you do not think you can stay reasonably active (staying on the computer, adequate effort for the tasks) for the full duration of this study (~30 minutes maximum, 20 minutes average), please close the browser now to end the study and avoid a rejection.</b> <br><br> During the study, you may be given short breaks after working on a puzzle for a few minutes. During these breaks please follow the instructions on the screen and <b>remain on the computer</b>. Please enable computer audio for use on some tasks. You will be automatically directed back to the puzzles after a few minutes.<br><br> It is important that you do not press the back and refresh buttons on your browser while you are working on this study. You are free to exit this study at any time by simply closing your browser. If you go back pages, refresh the page, or exit the study, your data will not be used and you will not be compensated for your time.<br><br>    </h1>",

  

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

            alert("You will now start working on the puzzles. Please enable the volume on your device for later parts of the study.");
            localStorage.setItem('idleTime',0);
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
    localStorage.setItem('conditionOrder', JSON.stringify(participantCondition.slice(-3)));
    // Randomize puzzle order
    const trialOrder = trials[Math.floor(Math.random() * trials.length)];
    localStorage.setItem('trial', JSON.stringify(trialOrder));
    localStorage.setItem('trialOrder', JSON.stringify(trialOrder));
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
    var isMobileDevice = false;

    // Check for features commonly found on mobile devices
    if (/Mobi/.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) || /webOS/i.test(navigator.userAgent) || /iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) || /iPod/i.test(navigator.userAgent) || /BlackBerry/i.test(navigator.userAgent) || /Windows Phone/i.test(navigator.userAgent)) {
        isMobileDevice = true;
    }

    if (isMobileDevice) {
        document.getElementById('web-popup').style.display = 'block';
        continueButton.style.display = 'none';
    }
};


function permute(nums) {
    const result = [];
    
    function backtrack(currPerm, remainingNums) {
        if (remainingNums.length === 0) {
            result.push(currPerm.slice()); // Push a copy of the current permutation to the result
            return;
        }
        
        for (let i = 0; i < remainingNums.length; i++) {
            currPerm.push(remainingNums[i]); // Choose
            const newRemaining = remainingNums.slice(0, i).concat(remainingNums.slice(i + 1)); // Explore
            backtrack(currPerm, newRemaining); // Explore
            currPerm.pop(); // Unchoose
        }
    }
    
    backtrack([], nums);
    return result;
}



getplayerId();

