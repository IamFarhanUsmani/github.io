// Swiper initialization
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,        // Display 1 active, 1 previous, 1 next
    centeredSlides: true,     // Always center the active slide
    spaceBetween: 30,         // Space between slides
    //loop: true,               // Loop through slides
    initialSlide: 1,  // Center latest Episode
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    effect: "cube",   // Slide effect (can use 'fade' or 'cube', swipe)
    keyboard: {
        enabled: true,
}
});

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


