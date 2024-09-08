// Swiper initialization
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3,        // Display 1 active, 1 previous, 1 next
    centeredSlides: true,     // Always center the active slide
    spaceBetween: 30,         // Space between slides
    loop: true,               // Loop through slides
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    effect: "cube",
      grabCursor: true,
      cubeEffect: {
        shadow: false,
        slideShadows: false,
        shadowOffset: 20,
        shadowScale: 0.94,
      },          // Slide effect (can use 'fade' or 'cube')
    keyboard: {
        enabled: true,
}
});

// Play/Pause functionality for audio on image click
function toggleAudio(audioId, imgElement) {
    const audio = document.getElementById(audioId);
    const progressBar = document.getElementById(`audio-bar${audioId.replace('audio', '')}`);
    
    if (audio.paused) {
        resetAllAudioExcept(audio); // Pause all other audios
        audio.play();
        // Start updating the progress bar
        audio.intervalId = setInterval(() => updateProgress(audioId, progressBar), 1000);
    } else {
        audio.pause();
        // Stop updating the progress bar
        clearInterval(audio.intervalId);
    }
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
    if (audio.duration) {
        const duration = audio.duration;
        const currentTime = audio.currentTime;
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
    }
}

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

