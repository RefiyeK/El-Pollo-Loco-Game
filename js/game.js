let canvas;
let world;
let keyboard = new Keyboard();
let isMusicOn = true;
let intervalIds = [];
let setIntervalIds = [];
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
    
    if(e.keyCode == 32) {
        e.preventDefault(); }
    
    if(gameState.paused || gameState.gameOver) {
        return; 
    }

    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
        if(!gameState.started && world) {
            gameState.started = true;
        }
    }
    if(e.keyCode == 37) {
        keyboard.LEFT = true;
        if(!gameState.started && world) {
            gameState.started = true;
        }
    }
    if(e.keyCode == 40) {
        keyboard.DOWN = true;
        if(!gameState.started && world) {
            gameState.started = true;
        }
    }
    if(e.keyCode == 38) {
        keyboard.UP = true;
        if(!gameState.started && world) {
            gameState.started = true;
        }
    }
    if(e.keyCode == 32) {
        keyboard.SPACE = true;
        if(!gameState.started && world) {
            gameState.started = true;
        }
    }
    if(e.keyCode == 68) {
        keyboard.D = true;
        if(!gameState.started && world) {
            gameState.started = true;
        }
    }
});

window.addEventListener("keyup", (e) => {

    if(gameState.paused || gameState.gameOver) {
        return;
    }

    if(e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if(e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if(e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if(e.keyCode == 38) {
        keyboard.UP = false;
    }
    if(e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if(e.keyCode == 68) {
        keyboard.D = false;
    }
});


/**
 * Resets the game state
 * All game states are set to initial values
 * @returns {void}
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
 * @returns {void}
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
 * @returns {void}
 */
function hideEndPanels() {
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
}


/**
 * Shows the game canvas
 * @returns {void}
 */
function showGameCanvas() {
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('controlPanel').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE';
}

/**
 * Starts the game from the main menu
 * 
 * This function:
 * - Hides the main menu
 * - Shows the game canvas
 * - Initializes the game world
 * - Starts background music
 * - Shows mobile controls (if mobile device)
 * 
 * @returns {void}
 */
function startGameFromHome() {
   
    document.getElementById('homeScreen').style.display = 'none'; 
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('controlPanel').style.display = 'flex';
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    
    gameState.started = true;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.paused = false;
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    startBackgroundMusic();
    showMobilControls();
}


/**
 * Pauses or resumes the game
 * Toggles between pause and continue
 * @returns {void}
 */
function pauseGame() {
    if(gameState.started && !gameState.gameOver && !gameState.won) {
        gameState.paused = !gameState.paused;
        
        if(gameState.paused) {
            if(gameState.musicOn) {
                pauseBackgroundMusic();
            }
            document.getElementById('pauseBtn').textContent = '▶️ WEITER';
        } else {
            if(gameState.musicOn) {
            resumeBackgroundMusic();
            }
            document.getElementById('pauseBtn').textContent = '⏸️ PAUSE';
        }
    }
}


/**
 * Resumes the game
 * Starts the game or ends the pause
 * @returns {void}
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
        document.getElementById('pauseBtn').textContent = '⏸️ PAUSE';
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
        musicBtn.innerHTML = '<span class="btn-icon">🎵MUSIK AN</span>';
    } else {
        musicBtn.innerHTML = '<span class="btn-icon">🔇MUSIK AUS</span>';
    }
    
    AudioHub.saveSettings();
}


/**
 * Restarts the game
 * All resources are reset but audio settings are preserved
 * @returns {void}
 */
function restartGame() {
    let savedVolume = AudioHub.currentVolume;
    let savedMuted = AudioHub.isMuted;
    let savedMusicIndex = selectedMusicIndex;

    if(world) {
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
    
    // Müziği durdur
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
 * @returns {void}
 */
function hideAllGamePanels() {
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('controlPanel').style.display = 'none';
}


/**
 * Shows the main menu
 * @returns {void}
 */
function showHomeScreen() {
    document.getElementById('homeScreen').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE';
}


/**
 * Resets the game state for main menu
 * @returns {void}
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
 * @returns {void}
 */
function goToHome() {
    if(world) {
        clearAllIntervals();
        world = null;
    }
    
    stopBackgroundMusic();
    resetGameStateForHome();
    keyboard = new Keyboard();
    hideAllGamePanels();
    showHomeScreen();
    hideMobilControls();
    
    setTimeout(() => {
        location.reload();
    }, 100);
}


/**
 * Clears all running intervals and timeouts
 * Cleans up resources when game ends or restarts
 */
function clearAllIntervals() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
    setIntervalIds.forEach(id => clearInterval(id));
    setIntervalIds = [];
    const maxId = 10000;
    for(let i = 0; i < maxId; i++) {
        clearInterval(i);
        clearTimeout(i);
    }
}


/**
 * Toggles sound on/off
 * Updates button texts and music status
 */
function toggleSound() {
    document.getElementById('soundBtn').textContent = gameState.musicOn ? 'TON AN' : 'TON AUS';
    document.getElementById('musicBtn').textContent = gameState.musicOn ? 'TON AN' : 'TON AUS';

    if(gameState.musicOn) {
        if(gameState.started && !gameState.paused) {
            startBackgroundMusic();
    } else {
        pauseBackgroundMusic();
        }
    }
}


/**
 * Toggles fullscreen mode on/off
 * Switches between normal and fullscreen mode
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
 * 
 * This function gets all button elements and connects them with
 * the corresponding keyboard events (LEFT, RIGHT, SPACE, D)
 * 
 * @function setupMobilControls
 * @returns {void}
 */
function setupMobilControls() {
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnjump = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    if(!btnLeft) return;

    /**
     * Touch-Start Event: Activate left movement
     * @param {TouchEvent} e - The touch event object
     */
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    
    /**
     * Touch-End Event: Deactivate left movement
     * @param {TouchEvent} e - The touch event object
     */
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });
    
    /**
     * Touch-Start Event: Activate right movement
     * @param {TouchEvent} e - The touch event object
     */
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    
    /**
     * Touch-End Event: Deactivate right movement
     * @param {TouchEvent} e - The touch event object
     */
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });
    
    /**
     * Touch-Start Event: Activate jump
     * @param {TouchEvent} e - The touch event object
     */
    btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    
    /**
     * Touch-End Event: Deactivate jump
     * @param {TouchEvent} e - The touch event object
     */
    btnJump.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });
    
    /**
     * Touch-Start Event: Activate throw
     * @param {TouchEvent} e - The touch event object
     */
    btnThrow.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    
    /**
     * Touch-End Event: Deactivate throw
     * @param {TouchEvent} e - The touch event object
     */
    btnThrow.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false; 
    });
}

/**
 * Shows mobile controls
 * Called when the game starts
 * Shows touch buttons only on mobile devices (screen width <= 1024px)
 * 
 * @function showMobilControls
 * @returns {void}
 */
function showMobilControls() {
    const mobilControls = document.getElementById('mobilControls');
        if (mobilControls && window.innerWidth <= 1024) {
            mobilControls.style.display = 'flex';
        }
}

/**
 * Hides mobile controls
 * Called when game ends, pauses, or returns to main menu
 * 
 * @function hideMobilControls
 * @returns {void}
 */
function hideMobilControls() {
    const mobilControls = document.getElementById('mobilControls');
        if (mobilControls) {
            mobilControls.style.display = 'none';
        }
}


/**
 * Initializes mobile controls on page load
 * This event listener ensures touch controls
 * are ready as soon as the page is fully loaded
 */
window.addEventListener('load', () => {
    setupMobilControls();
});


/**
 * Level selection function
 * @param {number} levelNumber - The selected level number
 */
function selectLevel(levelNumber) {
    if (levelNumber === 1) {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        console.log('Level ' + levelNumber + ' selected');
    }
}


/**
 * Opens the instructions dialog
 * Shows game controls and tips
 */
function openInfoDialog() {
    document.getElementById('infoDialog').style.display = 'flex';
}


/**
 * Closes the instructions dialog
 * Called when clicking X or outside the dialog
 */
function closeInfoDialog() {
    document.getElementById('infoDialog').style.display = 'none';
}


/**
 * Closes info dialog when clicking outside
 * Event listener for clicks outside dialog content
 */
document.addEventListener('click', (event) => {
    const infoDialog = document.getElementById('infoDialog');
    const infoContent = document.getElementById('infoContent');
        if (infoDialog && event.target === infoDialog) {
            closeInfoDialog();
        }
});


/**
 * Opens the About dialog
 * Shows project information in game-themed popup
 */
function openAboutDialog() {
    document.getElementById('aboutDialog').style.display = 'flex';
}

/**
 * Closes the About dialog
 */
function closeAboutDialog() {
    document.getElementById('aboutDialog').style.display = 'none';
}

/**
 * Closes About dialog when clicking outside
 */
document.addEventListener('click', (event) => {
    const aboutDialog = document.getElementById('aboutDialog');
    
    if (aboutDialog && event.target === aboutDialog) {
        closeAboutDialog();
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
    
    if(volumeHome) {
        volumeHome.value = AudioHub.currentVolume;
    }
    if(volumeGame) {
        volumeGame.value = AudioHub.currentVolume;
    }

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
        if(musicBtn) {
            musicBtn.textContent = '🔇 MUSIK AUS';
        }
    }

/**
 * Updates audio UI elements to match current settings
 * Syncs sliders and buttons with AudioHub state
 */
function updateAudioUI() {
    let volumeHome = document.getElementById('volumeHome');
    let volumeGame = document.getElementById('volumeGame');
    
    if(volumeHome) {
        volumeHome.value = AudioHub.currentVolume;
    }
    if(volumeGame) {
        volumeGame.value = AudioHub.currentVolume;
    }
    
    let musicBtn = document.getElementById('musicBtn');
    if(musicBtn) {
        if(AudioHub.isMuted) {
            musicBtn.innerHTML = '<span class="btn-icon">🔇</span><span class="btn-text">MUSIK AUS</span>';
        } else {
            musicBtn.innerHTML = '<span class="btn-icon">🎵</span><span class="btn-text">MUSIK AN</span>';
        }
    }
    
    gameState.musicOn = !AudioHub.isMuted;
    isMusicOn = !AudioHub.isMuted;
}
}