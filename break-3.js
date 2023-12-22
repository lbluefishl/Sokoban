const videos = document.querySelectorAll('[id^="v"]');
const loadingScreen = document.getElementById('loading-screen');
const loadingText = document.getElementById('loading');
const startButton = document.getElementById('start');
let loadedVideosCount = 0;
var isRedirecting = false;

// Function to check if all videos are loaded
function checkAllVideosLoaded() {
  loadedVideosCount++;
  if (loadedVideosCount >= 8) {
    // All videos are loaded, introduce a 2-second delay and then show the content
    setTimeout(() => {
      loadingText.style.display = 'none';
        startButton.style.display ='block';
    }, 2000); // 2000 milliseconds (2 seconds) delay
  }

}

startButton.addEventListener('click', function() {
    loadingScreen.style.display = 'none';
}
)

// Create an IntersectionObserver for each video element
videos.forEach(video => {
  video.addEventListener('loadeddata', checkAllVideosLoaded);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play();
      } else {
        if (!video.paused && entry.intersectionRatio < 1) {
          video.load();
          video.pause();
        } else {
          video.pause();
        }
      }
    });
  }, { threshold: 0 });

  observer.observe(video);

  const videoContainer = document.querySelector(`.video-container[data-video="${video.id}"]`);
  if (videoContainer) {
    videoContainer.style.height = video.videoHeight + 'px';
  }
});



    setTimeout(() => {
    localStorage.setItem('scroll', scrollCount)
    isRedirecting = true;
      window.location.href = 'return.html'; // Replace with your desired URL
    }, 300000);   // 5 minutes


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }

      const videoContainers = document.querySelectorAll('.video-container');
      const shuffledContainers = Array.from(videoContainers);
      shuffleArray(shuffledContainers);
  
      // Append the shuffled video containers back to the container
      const videoContainer = document.querySelector('.container');
      shuffledContainers.forEach(container => {
        videoContainer.appendChild(container);
      });


      let scrollCount = 0;
      const debouncedHandleScroll = debounce(handleScroll, 200)
      window.addEventListener('wheel', debouncedHandleScroll);

      function handleScroll() {
        scrollCount++;
      }

      function debounce(func, delay) {
        let timeoutId;
        return function() {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(func, delay);
        };
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