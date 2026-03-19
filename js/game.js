let canvas;
let world;
let keyboard = new Keyboard();
let isMusicOn = true;
let intervalIds = [];
let gameState = {
    started : false,
    paused : false,
    gameOver : false,
    won : false,
    musicOn : true,
};


/**
 * Checks if the game is active
 * @returns {boolean} True if game is started, not paused and not ended
 */
function isGameActive() {
    return gameState.started && !gameState.paused && !gameState.gameOver;
}


/**
 * Initializes the game
 * Gets the canvas element when the page loads
 */
function init() {
    canvas = document.getElementById('canvas');
    loadAudioSettings();
}

window.addEventListener("keydown", (e) => {
    if(e.key === ' ') { e.preventDefault(); }
    if(gameState.paused || gameState.gameOver) { return; }

    if(e.key === 'ArrowRight') { keyboard.RIGHT = true; }
    if(e.key === 'ArrowLeft') { keyboard.LEFT = true; }
    if(e.key === 'ArrowDown') { keyboard.DOWN = true; }
    if(e.key === 'ArrowUp') { keyboard.UP = true; }
    if(e.key === ' ') { keyboard.SPACE = true; }
    if(e.key === 'd' || e.key === 'D') { keyboard.D = true; }
});

window.addEventListener("keyup", (e) => {
    if(gameState.paused || gameState.gameOver) { return; }

    if(e.key === 'ArrowRight') { keyboard.RIGHT = false; }
    if(e.key === 'ArrowLeft') { keyboard.LEFT = false; }
    if(e.key === 'ArrowDown') { keyboard.DOWN = false; }
    if(e.key === 'ArrowUp') { keyboard.UP = false; }
    if(e.key === ' ') { keyboard.SPACE = false; }
    if(e.key === 'd' || e.key === 'D') { keyboard.D = false; }
});


/**
 * Resets the game state
 * All game states are set to initial values
 */
function resetGameState() {
    gameState.started = true;
    gameState.paused = false;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.musicOn = true;
}


/**
 * Resets all keyboard inputs
 */
function resetKeyboard() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}


/**
 * Hides game-over and win panels
 */
function hideEndPanels() {
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
}


/**
 * Shows the game canvas and control panel
 */
function showGameCanvas() {
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('controlPanel').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE';
}


/**
 * Starts the game from the main menu
 * Reuses existing helper functions to avoid duplication
 */
function startGameFromHome() {
    document.getElementById('homeScreen').style.display = 'none';
    showGameCanvas();
    hideEndPanels();
    resetGameState();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    startBackgroundMusic();
    showMobilControls();
}


/**
 * Pauses or resumes the game
 * Toggles between pause and continue
 */
function pauseGame() {
    if(gameState.started && !gameState.gameOver && !gameState.won) {
        gameState.paused = !gameState.paused;
        
        if(gameState.paused) {
            if(gameState.musicOn) {
                pauseBackgroundMusic();
            }
            document.getElementById('pauseBtn').textContent = ' WEITER';
        } else {
            if(gameState.musicOn) {
            resumeBackgroundMusic();
            }
            document.getElementById('pauseBtn').textContent = ' PAUSE';
        }
    }
}


/**
 * Resumes the game
 * Starts the game or ends the pause
 */
function resumeGame() {
    if(!gameState.started) {
        gameState.started = true;
    }
    
    if(gameState.paused) {
        gameState.paused = false;
         if(gameState.musicOn) {
            resumeBackgroundMusic();
         }
        document.getElementById('pauseBtn').textContent = ' PAUSE';
    }
}


/**
 * Toggles music on/off
 * Changes button text and mutes/unmutes ALL sounds
 */
function toggleMusic() {
    isMusicOn = !isMusicOn;
    gameState.musicOn = isMusicOn;
    
    AudioHub.toggleMute();
    
    const musicBtn = document.getElementById('musicBtn');
    if(isMusicOn) {
        musicBtn.innerHTML = '<span class="btn-icon"></span><span class="btn-text">MUSIK AN</span>';
    } else {
        musicBtn.innerHTML = '<span class="btn-icon"></span><span class="btn-text">MUSIK AUS</span>';
    }
    
    AudioHub.saveSettings();
}


/**
 * Restarts the game
 * All resources are reset but audio settings are preserved
 */
function restartGame() {
    let savedVolume = AudioHub.currentVolume;
    let savedMuted = AudioHub.isMuted;
    let savedMusicIndex = selectedMusicIndex;

    if(world) {
        world.stop();
        clearAllIntervals();
        world = null;
    }

    hideEndPanels();
    showGameCanvas();
    resetKeyboard();
    gameState = {
        started: true,
        paused: false,
        gameOver: false,
        won: false,
        musicOn: !savedMuted
    };
    AudioHub.currentVolume = savedVolume;
    AudioHub.isMuted = savedMuted;
    selectedMusicIndex = savedMusicIndex;
    
    stopBackgroundMusic();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    
    updateAudioUI();
    
    if(!savedMuted) {
        startBackgroundMusic();
    }
}


/**
 * Hides all game panels
 */
function hideAllGamePanels() {
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('controlPanel').style.display = 'none';
}


/**
 * Shows the main menu
 */
function showHomeScreen() {
    document.getElementById('homeScreen').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE';
}


/**
 * Resets the game state for main menu
 */
function resetGameStateForHome() {
    gameState = {
        started: false,
        paused: false,
        gameOver: false,
        won: false,
        musicOn: true,
    };
}


/**
 * Returns to the main menu
 * Stops the game and cleans up all resources
 */
function goToHome() {
    if(world) {
        world.stop();
        clearAllIntervals();
        world = null;
    }
    
    stopBackgroundMusic();
    resetGameStateForHome();
    keyboard = new Keyboard();
    hideAllGamePanels();
    showHomeScreen();
    hideMobilControls();
}


/**
 * Clears all running intervals and timeouts
 */
function clearAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
}


/**
 * Toggles fullscreen mode on/off
 */
function toggleFullscreen() {
    if(!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}


/**
 * Sets up mobile touch controls
 * Connects touch events with keyboard controls
 */
function setupMobilControls() {
    const btnLeft  = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnJump  = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    if(!btnLeft) return;

    bindTouchButton(btnLeft,  'LEFT');
    bindTouchButton(btnRight, 'RIGHT');
    bindTouchButton(btnJump,  'SPACE');
    bindTouchButton(btnThrow, 'D');
}


/**
 * Binds touchstart/touchend events to a keyboard key
 * @param {HTMLElement} btn - The button element
 * @param {string} key - The keyboard key name to toggle
 */
function bindTouchButton(btn, key) {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[key] = true;
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[key] = false;
    }, { passive: false });
}


/**
 * Initializes mobile controls on page load
 */
window.addEventListener('load', () => {
    setupMobilControls();
});


/**
 * Opens the instructions dialog
 */
function openInfoDialog() {
    document.getElementById('infoDialog').style.display = 'flex';
}


/**
 * Closes the instructions dialog
 */
function closeInfoDialog() {
    document.getElementById('infoDialog').style.display = 'none';
}


/**
 * Closes info dialog when clicking outside the content box
 */
document.addEventListener('click', (event) => {
    const infoDialog = document.getElementById('infoDialog');
    if (infoDialog && event.target === infoDialog) {
        closeInfoDialog();
    }
});


/**
 * Loads audio settings from LocalStorage
 * Restores volume, mute state, and selected music
 */
function loadAudioSettings() {
    AudioHub.loadSettings();
    
    let volumeHome = document.getElementById('volumeHome');
    let volumeGame = document.getElementById('volumeGame');
    
    if(volumeHome) volumeHome.value = AudioHub.currentVolume;
    if(volumeGame) volumeGame.value = AudioHub.currentVolume;

    let savedMusic = localStorage.getItem('selectedMusic');
    if(savedMusic !== null) {
        selectedMusicIndex = parseInt(savedMusic);
        let dropdown = document.getElementById('musicDropdown');
        if(dropdown) {
            dropdown.value = selectedMusicIndex;
            document.getElementById('previewBtn').disabled = false;
        }
    }
    
    if(AudioHub.isMuted) {
        isMusicOn = false;
        gameState.musicOn = false;
        let musicBtn = document.getElementById('musicBtn');
        if(musicBtn) musicBtn.textContent = ' MUSIK AUS';
    }
}


/**
 * Updates audio UI elements to match current settings
 */
function updateAudioUI() {
    let volumeHome = document.getElementById('volumeHome');
    let volumeGame = document.getElementById('volumeGame');
    
    if(volumeHome) volumeHome.value = AudioHub.currentVolume;
    if(volumeGame) volumeGame.value = AudioHub.currentVolume;
    
    let musicBtn = document.getElementById('musicBtn');
    if(musicBtn) {
        if(AudioHub.isMuted) {
            musicBtn.innerHTML = '<span class="btn-icon"></span><span class="btn-text">MUSIK AUS</span>';
        } else {
            musicBtn.innerHTML = '<span class="btn-icon"></span><span class="btn-text">MUSIK AN</span>';
        }
    }
    
    gameState.musicOn = !AudioHub.isMuted;
    isMusicOn = !AudioHub.isMuted;
}

/**
 * Shows mobile controls — handled by CSS
 */
function showMobilControls() {}


/**
 * Hides mobile controls — handled by CSS
 */
function hideMobilControls() {}