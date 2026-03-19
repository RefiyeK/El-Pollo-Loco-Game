/**
 * Selected music index (-1 = no selection)
 * @type {number}
 */
let selectedMusicIndex = -1;


/**
 * Audio object for music preview
 * @type {Audio|null}
 */
let previewAudio = null;

 

/**
 * Starts random background music
 * Selects a random index (0-3) and plays the music
 */
function startRandomMusic() {
    let randomMusicIndex = Math.floor(Math.random() * 4);
    AudioHub.playMusic(randomMusicIndex);
    
    let dropdown = document.getElementById('musicDropdown');
    if(dropdown) {
        dropdown.value = randomMusicIndex.toString();
    }
    
    let previewBtn = document.getElementById('previewBtn');
    if(previewBtn) {
        previewBtn.disabled = false;
    }
    
    selectedMusicIndex = randomMusicIndex;
    
    localStorage.setItem('selectedMusic', selectedMusicIndex.toString());
}


/**
 * Called when music is changed in dropdown
 * Enables/Disables the preview button
 */
function onMusicChange() {
    let dropdown = document.getElementById('musicDropdown');
    selectedMusicIndex = parseInt(dropdown.value);
    
    if(selectedMusicIndex >= 0) {
        document.getElementById('previewBtn').disabled = false;
        localStorage.setItem('selectedMusic', selectedMusicIndex.toString());
    } else {
        document.getElementById('previewBtn').disabled = true;
        localStorage.removeItem('selectedMusic');
    }
    stopPreview();
}


/**
 * Plays the selected music as preview
 * Stops previous preview automatically
 */
function previewSelectedMusic() {
    stopPreview();

    if(selectedMusicIndex >= 0 && selectedMusicIndex < AudioHub.allBackgroundMusic.length) {
        previewAudio = AudioHub.allBackgroundMusic[selectedMusicIndex];
        previewAudio.volume = AudioHub.currentVolume;
        previewAudio.loop = true;
        previewAudio.currentTime = 0;
        
        if(!AudioHub.isMuted) {
            previewAudio.play().catch(e => {
                console.warn("Preview could not be played:", e);
            });
        }
    }
}


/**
 * Stops the music preview
 * Resets the audio object
 */
function stopPreview() {
    if(previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
        previewAudio = null;
    }
}


/**
 * Starts background music for the game
 * Uses selected music or starts random music
 */
function startBackgroundMusic() {
    stopPreview();
    
    if(AudioHub.isMuted) return;

    let savedMusic = localStorage.getItem('selectedMusic');
    if(savedMusic !== null) {
        selectedMusicIndex = parseInt(savedMusic);
    }
    
    if(selectedMusicIndex >= 0) {
        AudioHub.playMusic(selectedMusicIndex);
        syncMusicDropdown(selectedMusicIndex);
    } else {
        startRandomMusic();
    }
}


/**
 * Syncs music dropdown UI to the given index
 * @param {number} index - Music index to show in dropdown
 */
function syncMusicDropdown(index) {
    const dropdown = document.getElementById('musicDropdown');
    const previewBtn = document.getElementById('previewBtn');
    if (dropdown) dropdown.value = index.toString();
    if (previewBtn) previewBtn.disabled = false;
}


/**
 * Stops background music completely
 */
function stopBackgroundMusic() {
    AudioHub.stopMusic();
}


/**
 * Pauses background music
 */
function pauseBackgroundMusic() {
    AudioHub.pauseMusic();
}


/**
 * Resumes background music
 */
function resumeBackgroundMusic() {
    AudioHub.resumeMusic();
}


/**
 * Sets the music volume
 * @param {number} volume - Volume (0.0 to 1.0)
 */
function setMusicVolume(volume) {
    volume = Math.max(0.0, Math.min(1.0, volume));

    if(AudioHub && AudioHub.currentMusic) {
        AudioHub.currentMusic.volume = volume;
    }
}