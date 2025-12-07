/**
 * Ausgewählter Musik-Index (-1 = keine Auswahl)
 * @type {number}
 */
let selectedMusicIndex = -1;


/**
 * Audio-Objekt für Musik-Vorschau
 * @type {Audio|null}
 */
let previewAudio = null;

 

/**
 * Startet eine zufällige Hintergrundmusik
 * Wählt einen zufälligen Index (0-3) und spielt die Musik ab
 */
function startRandomMusic() {
   let randomMusicIndex = Math.floor(Math.random() * 4);
    AudioHub.playMusic(randomMusicIndex);
    document.getElementById('musicDropdown').value = randomMusicIndex.toString();
    document.getElementById('previewBtn').disabled = false;
    selectedMusicIndex = randomMusicIndex;
}


/**
 * Wird aufgerufen wenn Musik im Dropdown geändert wird
 * Aktiviert/Deaktiviert den Preview-Button
 */
function onMusicChange() {
    let dropdown = document.getElementById('musicDropdown');
    selectedMusicIndex = parseInt(dropdown.value);
    
    if(selectedMusicIndex >= 0) {
        document.getElementById('previewBtn').disabled = false;
    } else {
        document.getElementById('previewBtn').disabled = true;
    }
    stopPreview();
}


/**
 * Spielt die ausgewählte Musik als Vorschau ab
 * Stoppt vorherige Vorschau automatisch
 */
function previewSelectedMusic() {
    stopPreview();

    if(selectedMusicIndex >= 0 && selectedMusicIndex < AudioHub.allBackgroundMusic.length) {
        previewAudio = AudioHub.allBackgroundMusic[selectedMusicIndex];
        previewAudio.volume = 0.2;
        previewAudio.loop = true;
        previewAudio.currentTime = 0;
        previewAudio.play();
    }
}


/**
 * Stoppt die Musik-Vorschau
 * Setzt das Audio-Objekt zurück
 */
function stopPreview() {
    if(previewAudio) {
        previewAudio.pause();
        previewAudio.currentTime = 0;
        previewAudio = null;
    }
}


/**
 * Startet die Hintergrundmusik für das Spiel
 * Verwendet ausgewählte Musik oder startet zufällige Musik
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
 * Stoppt die Hintergrundmusik komplett
 */
function stopBackgroundMusic() {
    AudioHub.stopMusic();
}


/**
 * Pausiert die Hintergrundmusik
 */
function pauseBackgroundMusic() {
    AudioHub.pauseMusic();
}


/**
 * Setzt die Hintergrundmusik fort
 */
function resumeBackgroundMusic() {
    AudioHub.resumeMusic();
}


/**
 * Stellt die Musiklautstärke ein
 * @param {number} volume - Lautstärke (0.0 bis 1.0)
 */
function setMusicVolume(volume) {
    volume = Math.max(0.0, Math.min(1.0, volume));

    if(AudioHub && AudioHub.currentMusic) {
        AudioHub.currentMusic.volume = volume;
        }
}