// Swiper initialization
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,        // Display 1 active, 1 previous, 1 next
    centeredSlides: true,     // Always center the active slide
    spaceBetween: 30,         // Space between slides
    //loop: true,               // Loop through slides
    initialSlide: 7,  // Center latest Episode
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

// Ticker
const scriptURL = 'https://script.google.com/macros/s/AKfycbx2UMxV0iYHbpoPhoH1OF_77MemdRN_ezEqU0asyHMGl8AhaBarcY18yE8vkTab5UCGcQ/exec';
let tickerContainer;
let comments = [];
let isAnimating = false;

function loadCommentsTicker() {
    tickerContainer = document.getElementById('comments-ticker');
    fetchComments();
}

function fetchComments() {
    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            // Add new comments to the existing array
            comments = [...data]; // Replace with new comments
            if (!isAnimating) {
                startTickerAnimation();
            }
        })
        .catch(error => console.error('Error fetching comments:', error));
}

function startTickerAnimation() {
    if (comments.length === 0) return; // Ensure there are comments to display
    isAnimating = true; // Set the flag to indicate animation is in progress

    // Clear existing ticker items
    tickerContainer.innerHTML = '';

    // Create ticker items from the comments array, starting with the latest
    comments.slice().reverse().forEach(comment => { // Reverse to show latest first
        const commentElement = document.createElement('div');
        commentElement.classList.add('ticker-item');
        commentElement.innerHTML = `<strong>${comment.name}:</strong> ${comment.comment}`;
        tickerContainer.appendChild(commentElement);
    });

    // Clone the ticker for looping
    const tickerClone = tickerContainer.cloneNode(true);
    tickerContainer.parentElement.appendChild(tickerClone);

    let tickerWidth = tickerContainer.scrollWidth; // Get total width of ticker
    let tickerPosition = 0;

    function animate() {
        tickerPosition -= 1; // Move the ticker left by 1px
        tickerContainer.style.transform = `translateX(${tickerPosition}px)`;
        tickerClone.style.transform = `translateX(${tickerPosition + tickerWidth}px)`; // Position the clone after the original

        // Reset only after the entire ticker scrolls off-screen
        if (tickerPosition <= -tickerWidth) {
            tickerPosition = 0;
            tickerContainer.remove(); // Remove the original ticker
            tickerClone.style.transform = 'translateX(0)'; // Reset clone for the next animation
            isAnimating = false; // Reset the animation flag
            // Optionally fetch new comments after animation is complete
            fetchComments();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

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

