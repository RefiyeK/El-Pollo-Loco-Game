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
    document.getElementById('musicDropdown').value = randomMusicIndex.toString();
    document.getElementById('previewBtn').disabled = false;
    selectedMusicIndex = randomMusicIndex;
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
        localStorage.setItem('selectedMusic', selectedMusicIndex);
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
        previewAudio.volume = 0.1;
        previewAudio.loop = true;
        previewAudio.currentTime = 0;
        previewAudio.play();
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
        
    if(selectedMusicIndex >= 0) {
         AudioHub.playMusic(selectedMusicIndex);
        } else {
            startRandomMusic();
        }
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