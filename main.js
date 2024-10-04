// Swiper initialization
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,        // Display 1 active, 1 previous, 1 next
    centeredSlides: true,     // Always center the active slide
    spaceBetween: 30,         // Space between slides
    //loop: true,               // Loop through slides
    initialSlide: 9,  // Center latest Episode
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
 //   pagination: {
   //     el: '.swiper-pagination',
     //   clickable: true,
    //},
    effect: "swipe",   // Slide effect (can use 'fade' or 'cube', slide)
    keyboard: {
        enabled: true,
}
});

// Get the modal
var modal = document.getElementById("comment-modal");

// Get the button that opens the modal
var commentBtn = document.getElementById("comment-btn"); // Add an ID to your comment button

// Get the <span> element that closes the modal
var closeBtn = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
commentBtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Comment form submission
document.getElementById("comment-form").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form from reloading the page

  var commentText = document.getElementById("comment-text").value;
  var commentName = document.getElementById("comment-name").value;

  // Ensure the user fills in both fields
  if (commentText.length > 300 || commentName.trim() === '') {
    alert("Please ensure your comment is under 300 characters and the name is filled.");
    return;
  }

  // Post data to Google Apps Script
  var scriptURL = 'https://script.google.com/macros/s/AKfycbx2UMxV0iYHbpoPhoH1OF_77MemdRN_ezEqU0asyHMGl8AhaBarcY18yE8vkTab5UCGcQ/exec'; // Replace with your Apps Script URL
  var params = new URLSearchParams({
    'comment': commentText,
    'name': commentName
  });

  fetch(scriptURL + '?' + params.toString(), { method: 'POST' })
    .then(response => response.text())
    .then(result => {
      alert("Comment posted successfully!");
      document.getElementById("comment-form").reset(); // Clear the form
      modal.style.display = "none"; // Close the modal
    })
    .catch(error => {
      alert("There was an error posting your comment.");
      console.error('Error:', error);
    });
});

// Ticker URL and Data
const scriptURL = 'https://script.google.com/macros/s/AKfycbx2UMxV0iYHbpoPhoH1OF_77MemdRN_ezEqU0asyHMGl8AhaBarcY18yE8vkTab5UCGcQ/exec';
let comments = [];

function loadCommentsTicker() {
    populateTickerPlaceholder(); // Show placeholder immediately
    fetchComments();
}

function fetchComments() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            comments = [...data];
            populateTicker(); // Populate the ticker with fetched comments
        })
        .catch(error => console.error('Error fetching comments:', error));
}

function populateTickerPlaceholder() {
    const tickerContainer = document.getElementById('comments-ticker');
    tickerContainer.innerHTML = ''; // Clear previous items

    const placeholderElement = document.createElement('div');
    placeholderElement.classList.add('ticker-item');
    placeholderElement.innerHTML = 'Loading comments...'; // Placeholder text
    tickerContainer.appendChild(placeholderElement);

    tickerContainer.classList.add('start-animation'); // Start animation immediately
}

function populateTicker() {
    const tickerContainer = document.getElementById('comments-ticker');
    tickerContainer.innerHTML = ''; // Clear previous items or placeholder

    comments.slice().reverse().forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('ticker-item');
        commentElement.innerHTML = `<strong>${comment.name}:</strong> ${comment.comment}`;
        tickerContainer.appendChild(commentElement);
    });

    duplicateTickerContent(tickerContainer); // Duplicate content for seamless loop
    adjustTickerSpeed(tickerContainer); // Adjust speed dynamically
    tickerContainer.classList.add('start-animation'); // Ensure animation starts with new data
}

// Dynamically adjust the speed based on the length of the ticker content
function adjustTickerSpeed(tickerContainer) {
    const contentLength = tickerContainer.scrollWidth; // Get the total width of the content
    const screenWidth = window.innerWidth;
    const speedFactor = 5; // Adjust this factor to slow down the ticker speed (higher value = slower)
    const duration = Math.max(contentLength / screenWidth * speedFactor, 40); // Minimum 40 seconds for readability

    tickerContainer.style.animationDuration = `${duration}s`; // Apply dynamic speed
}

// Duplicate content for seamless looping
function duplicateTickerContent(tickerContainer) {
    const originalContent = tickerContainer.innerHTML;
    tickerContainer.innerHTML += originalContent; // Duplicate the ticker content
}

// Load the ticker on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadCommentsTicker);  

// Play/Pause functionality for audio on image click (only if the slide is active)
function toggleAudio(audioId, imgElement) {
    const swiperSlide = imgElement.closest('.swiper-slide');
    
    // Check if the image is inside the active slide
    if (!swiperSlide.classList.contains('swiper-slide-active')) {
        console.log('Image is not in the center, click is disabled.');
        return; // Prevent play/pause if the image is not in the center
    }

    // Existing play/pause logic
    const audio = document.getElementById(audioId);
    const progressBar = document.getElementById(`audio-bar${audioId.replace('audio', '')}`);
    const icon = document.getElementById(`play-pause-icon${audioId.replace('audio', '')}`);
    
    if (!audio || !progressBar || !icon) {
        console.error('Audio, progress bar, or icon element not found.');
        return;
    }
    
    if (audio.paused) {
        resetAllAudioExcept(audio); // Pause all other audios
        audio.play();
        // Start updating the progress bar
        audio.intervalId = setInterval(() => updateProgress(audioId, progressBar), 1000);
        // Change icon to pause
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        audio.pause();
        // Stop updating the progress bar
        clearInterval(audio.intervalId);
        // Change icon to play
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }

    // Add the click effect to the audio bar
    applyAudioBarClickEffect(progressBar);
}


// Apply the click effect to the audio bar
function applyAudioBarClickEffect(progressBar) {
    // Add the 'audio-bar-clicked' class to the progress bar
    progressBar.classList.add('audio-bar-clicked');

    // Remove the class after 200ms to reset the visual effect
    setTimeout(() => {
        progressBar.classList.remove('audio-bar-clicked');
    }, 200);
}

// Reset all audios except the current one
function resetAllAudioExcept(currentAudio) {
    document.querySelectorAll('audio').forEach(audio => {
        if (audio !== currentAudio) {
            audio.pause();
            clearInterval(audio.intervalId);
        }
    });
}

// Update the progress bar based on the audio's current time
function updateProgress(audioId, progressBar) {
    const audio = document.getElementById(audioId);
    const startTimeElem = document.getElementById(`start-time${audioId.replace('audio', '')}`);
    const endTimeElem = document.getElementById(`end-time${audioId.replace('audio', '')}`);
    
    if (audio && !isNaN(audio.duration) && audio.duration > 0) {
        const duration = audio.duration;
        const currentTime = audio.currentTime;
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        if (startTimeElem) startTimeElem.textContent = formatTime(currentTime);
        if (endTimeElem) endTimeElem.textContent = formatTime(duration);
    } else {
        console.error('Audio duration is not valid.');
    }
}

// Format time from seconds to mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Set audio time based on the range input
function setAudioTime(audioId, value) {
    const audio = document.getElementById(audioId);
    const duration = audio.duration;
    if (audio && !isNaN(duration) && duration > 0) {
        audio.currentTime = (value / 100) * duration;
    } else {
        console.error('Audio duration is not valid.');
    }
}

// Event listener for range input changes
document.querySelectorAll('input[type="range"]').forEach(range => {
    range.addEventListener('input', (event) => {
        const audioId = `audio${event.target.id.replace('audio-bar', '')}`;
        setAudioTime(audioId, event.target.value);
    });
});


// Set audio time based on the range input
function setAudioTime(audioId, value) {
    const audio = document.getElementById(audioId);
    const duration = audio.duration;
    audio.currentTime = (value / 100) * duration;
}

// Event listener for range input changes
document.querySelectorAll('input[type="range"]').forEach(range => {
    range.addEventListener('input', (event) => {
        const audioId = `audio${event.target.id.replace('audio-bar', '')}`;
        setAudioTime(audioId, event.target.value);
    });
});

