
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
 * Prüft ob das Spiel aktiv ist
 * @returns {boolean} True wenn Spiel gestartet, nicht pausiert und nicht beendet
 */
function isGameActive() {
    return gameState.started && !gameState.paused && !gameState.gameOver;
}


/**
 * Initialisiert das Spiel
 * Holt das Canvas-Element beim Laden der Seite
 */
function init() {
    canvas = document.getElementById('canvas');
}

window.addEventListener("keydown", (e) => {
    
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
 * Setzt den Spielstatus zurück
 * Alle Spielzustände werden auf Startwerte gesetzt
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
 * Setzt alle Tastatureingaben zurück
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
 * Versteckt Game-Over und Win-Panels
 * @returns {void}
 */
function hideEndPanels() {
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
}


/**
 * Zeigt das Spielfeld an
 * @returns {void}
 */
function showGameCanvas() {
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('controlPanel').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE';
}

/**
 * Startet das Spiel vom Hauptmenü aus
 * 
 * Diese Funktion:
 * - Versteckt das Hauptmenü
 * - Zeigt das Spielfeld (Canvas) an
 * - Initialisiert die Spielwelt
 * - Startet die Hintergrundmusik
 * - Zeigt mobile Steuerungen an (falls mobiles Gerät)
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
 * Pausiert oder setzt das Spiel fort
 * Schaltet zwischen Pause und Weiter um
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
 * Setzt das Spiel fort
 * Startet das Spiel oder beendet die Pause
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
 * Schaltet die Musik ein/aus
 * Ändert Button-Text und spielt/pausiert Musik
 */
function toggleMusic() {
    isMusicOn = !isMusicOn;
    gameState.musicOn = isMusicOn;
    
    if(isMusicOn) {
        resumeBackgroundMusic();
        document.getElementById('musicBtn').textContent = '🎵 MUSIK AN';
    } else {
        pauseBackgroundMusic();
        document.getElementById('musicBtn').textContent = '🔇 MUSIK AUS';
    }
}


/**
 * Startet das Spiel neu
 * Alle Ressourcen werden zurückgesetzt
 * @returns {void}
 */
function restartGame() {
    if(world) {
        clearAllIntervals();
        world = null;
    }
    
    hideEndPanels();
    showGameCanvas();
    resetKeyboard();
    resetGameState();
    world = new World(canvas, keyboard);
    stopBackgroundMusic();
    startBackgroundMusic();
}


/**
 * Versteckt alle Spiel-Panels
 * @returns {void}
 */
function hideAllGamePanels() {
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('controlPanel').style.display = 'none';
}


/**
 * Zeigt das Hauptmenü an
 * @returns {void}
 */
function showHomeScreen() {
    document.getElementById('homeScreen').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE';
}


/**
 * Setzt den Spielstatus für Hauptmenü zurück
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
 * Kehrt zum Hauptmenü zurück
 * Stoppt das Spiel und räumt alle Ressourcen auf
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
 * Löscht alle laufenden Intervalle und Timeouts
 * Räumt Ressourcen auf beim Spielende oder Neustart
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
 * Schaltet den Ton ein/aus
 * Aktualisiert Button-Texte und Musik-Status
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
 * Schaltet den Vollbild-Modus ein/aus
 * Wechselt zwischen normalem und Vollbild-Modus
 */
function toggleFullscreen() {
    if(!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
        }
}

/**
 * Richtet die mobilen Touch-Steuerungen ein
 * Verbindet die Touch-Events mit der Tastatur-Steuerung
 * 
 * Diese Funktion holt alle Button-Elemente und verbindet sie mit
 * den entsprechenden tastatur-Events (LEFT, RIGHT, SPACE, D)
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

    //LINKS_BUTTON
    /**
     * Touch-Start Event: Linke Bewegung aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });
    
    /**
     * Touch-Ende Event: Linke Bewegung deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });
    
    /**
     * Touch-Start Event: Rechte Bewegung aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });
    
    /**
     * Touch-Ende Event: Rechte Bewegung deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });
    
    /**
     * Touch-Start Event: Sprung aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });
    
    /**
     * Touch-Ende Event: Sprung deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnJump.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });
    
    /**
     * Touch-Start Event: Wurf aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnThrow.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard.D = true;
    });
    
    /**
     * Touch-Ende Event: Wurf deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnThrow.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard.D = false; 
    });
}

/**
 * Zeigt die mobilen Steuerungen an
 * Wird aufgerufen, wenn das Spiel startet.
 * Zeigt die Touch-Buttons nur auf mobilen Geräten an (Bildschirmbreite <= 1024px)
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
 * Versteckt die mobilen Steuerungen
 * Wird aufgerufen, wenn das Spiel endet, pausiert wird oder zum Hauptmenü zurückgekehrt wird
 * 
 * @function hideMobilControls
 * @returns {void}
 */
function hideMobilControls() {
    const mobilControls = document.getElementById('mobilControls');
        if (mobilControls) {
            mobilControls.style.display = 'none'; // Steuerung ausblenden
        }
}


/**
 * Initialisiert die mobilen Steuerungen beim Laden der Seite
 * Dieser Event-Listener stellt sicher, dass die Touch-Steuerungen
 * bereit sind, sobald die Seite vollständig geladen ist
 */
window.addEventListener('load', () => {
    setupMobilControls();
});


/**
 * Level-Auswahlfunktion
 * @param {number} levelNumber - Die ausgewählte Level-Nummer
 */
function selectLevel(levelNumber) {
    if (levelNumber === 1) {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        console.log('Level ' + levelNumber + ' ausgewählt');
    }
}


/**
 * Öffnet den Anleitung-Dialog
 * Zeigt die Spielsteuerung und Tipps an
 */
function openInfoDialog() {
    document.getElementById('infoDialog').style.display = 'flex';
}


/**
 * Schließt den Anleitung-Dialog
 * Wird aufgerufen beim Klick auf X oder außerhalb des Dialogs
 */
function closeInfoDialog() {
    document.getElementById('infoDialog').style.display = 'none';
}


/**
 * Schließt den Info-Dialog bei Klick außerhalb
 * Event-Listener für Click außerhalb des Dialog-Inhalts
 */
document.addEventListener('click', (event) => {
    const infoDialog = document.getElementById('infoDialog');
    const infoContent = document.getElementById('infoContent');
        if (infoDialog && event.target === infoDialog) {
            closeInfoDialog();
        }
});