// const { startTransition } = require("react");

let canvas;
let world;
let keyboard = new Keyboard();
let isMusicOn = true; //Müzik acik mi kapali mi
let intervalIds = []; //intervalleri takip etmek icin global array

let gameState = {
    started : false, // Oyun başladı mı?
    paused : false, // Oyun duraklatıldı mı?
    gameOver : false, // Oyun bitti mi?
    won : false, // Oyuncu kazandı mı?
    musicOn : true, // Müzik açık mı?
};

function isGameActive() {
    return gameState.started && !gameState.paused && !gameState.gameOver;
}


function init() {
    canvas = document.getElementById('canvas');
    // world = new World(canvas, keyboard);
    // setupButtonListeners(); // Buton listener'ları kur (gerekirse)
    // startRandomMusic(); //Rastgele müzik baslat
}

window.addEventListener("keydown", (e) => {
    
    //Oyun pause ise veya bitmişse klavye çalışmasın
    if(gameState.paused || gameState.gameOver) {
        return; // Hiçbir tuşa basma
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

    //Oyun pause ise veya bitmişse klavye çalışmasın
    if(gameState.paused || gameState.gameOver) {
        return; // Hiçbir tuşa basma
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

function startGameFromHome() { //Müzik secildi mi kontrol et
   
    // Ana ekranı gizle
    document.getElementById('homeScreen').style.display = 'none'; //Ana ekrani gizle
    // Oyun ekranlarını göster
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('controlPanel').style.display = 'flex';
    // Panelleri gizle (eğer açıksa)
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    
    // Oyun durumunu güncelle
    gameState.started = true;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.paused = false;

    // Oyunu başlat (World olustur)
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    // Müziği başlat (SEÇİLİ OLMASA BİLE!)
    startBackgroundMusic();

    // Mobile Steuerung anzeigen
    showMobilControls();
}

//Oyunu duraklat (PAUSE butonu)
function pauseGame() {
    //Oyun başlamışsa, oyun bitmemişse ve kazanılmamışsa içeri gir
    if(gameState.started && !gameState.gameOver && !gameState.won) {
        //paused durumunu tersine çevir (true ise false, false ise true yap)
        gameState.paused = !gameState.paused;
        
        if(gameState.paused) { //Eğer oyun şu an duraklatıldıysa
            if(gameState.musicOn) { //Müzik aciksa duraklat
                pauseBackgroundMusic(); //Müzik açıksa müziği duraklat
            } //Buton yazısını "WEITER" yap
            document.getElementById('pauseBtn').textContent = 'WEITER';
        } else { //Eğer oyun devam ediyorsa
            if(gameState.musicOn) { //Müzik aciksa devam ettir
            resumeBackgroundMusic();
            } //Buton yazısını "PAUSE" yap
            document.getElementById('pauseBtn').textContent = 'PAUSE';
        }
    }
}


//Oyunu devam ettir (START butonu)
function resumeGame() {
    if(!gameState.started) {
        gameState.started = true;
    }
    
    if(gameState.paused) {
        gameState.paused = false;
         if(gameState.musicOn) { //Müzik aciksa devam ettir
            resumeBackgroundMusic();
         }
        document.getElementById('pauseBtn').textContent = 'PAUSE';
    }
}


//Müziği aç/kapat (MUSIK AN/AUS butonu)
function toggleMusic() {
    isMusicOn = !isMusicOn;
    gameState.musicOn = isMusicOn;
    
    if(isMusicOn) {
        resumeBackgroundMusic();
        document.getElementById('musicBtn').textContent = 'MUSIK AN';
    } else {
        pauseBackgroundMusic();
        document.getElementById('musicBtn').textContent = 'MUSIK AUS';
    }
}


//Oyunu yeniden başlat (NOCHMAL SPIELEN butonu)
function restartGame() {    
    
    //Eski oyunu (world) temizle.(world değişkenini null yaparak eski oyunu bellekten kaldırır)
    if(world) {
        clearAllIntervals();
        world= null;
    }

    // EKRANI GÜNCELLE
    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    
    const canvas = document.getElementById('canvas');
    canvas.style.display = 'block';
    document.getElementById('controlPanel').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE'; //Pause butonunun yazısını "PAUSE" olarak ayarlar. Pause varsa Weiter olarak düzeltir
    
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
    
     //Tüm oyun durum değişkenlerini başlangıç değerlerine döndürür.
    gameState.started = true;
    gameState.paused = false;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.musicOn = true;

    //  runGameLoop(); //Karakterlerin hareketini saglayan ana döngüyü yeniden baslatir

    world = new World(canvas, keyboard);
    
    stopBackgroundMusic(); 
    startBackgroundMusic();      
}


/**
 * Kehrt zum Hauptmenü zurück
 * 
 * Diese Funktion:
 * - Stoppt das Spiel und räumt alle Ressourcen auf
 * - Löscht alle laufenden Intervalle
 * - Stoppt die Hintergrundmusik
 * - Setzt den Spielstatus zurück
 * - Versteckt die mobilen Steuerungen
 * - Lädt die Seite neu
 * 
 * @function goToHome
 * @returns {void}
 */
function goToHome() { //ANA SAYFAYA DÖN (HAUPTSEITE butonu)
    if(world) { //intervalleri temizle(zaman aralığı boyunca sürekli olarak, defalarca çalışan fonksiyon)
        clearAllIntervals();
        world = null;
    }
    
    stopBackgroundMusic(); //müzigi durdur

    gameState = { //Oyun durumunu sifirla (Tüm oyun durum değişkenlerini başlangıç değerlerine döndürür)
        started: false,
        paused: false,
        gameOver: false,
        won: false,
        musicOn: true,
        };
    keyboard = new Keyboard(); //Klavye durumlari temizlenir. Yeni bir klavye nesnesi olusturur

    document.getElementById('gameOverPanel').style.display = 'none';
    document.getElementById('winPanel').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('controlPanel').style.display = 'none';
    document.getElementById('homeScreen').style.display = 'flex';
    document.getElementById('pauseBtn').textContent = 'PAUSE'; //Pause butonunun yazısını "PAUSE" olarak ayarlar. Pause varsa Weiter olarak düzeltir
    // startRandomMusic(); //Ana menü icin rastgele bir müzik baslatir

    // Mobile Steuerung ausblenden
    hideMobilControls();
    
    //sayfayi yenile
    setTimeout(() => {
        location.reload(); //sayfayi yeniden yükle
    }, 100);
}

let setIntervalIds = []; //intervalleri temizle(zaman aralığı boyunca sürekli olarak, defalarca çalışan fonksiyon)

function clearAllIntervals() {

    //World`deki intervalleri temizle
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];

    //tüm intervalleri temizle
    setIntervalIds.forEach(id => clearInterval(id));
    setIntervalIds = [];

    // Ek güvenlik için. Ttüm eski hareket döngülerini temizle
    const maxId = 10000;
    for(let i = 0; i < maxId; i++) {
        clearInterval(i);
        clearTimeout(i);
    }
}

 //Sesi aç/kapat (TON AN/AUS butonu)
function toggleSound() {
    
    //Buton yazilarini güncelle
    document.getElementById('soundBtn').textContent = gameState.musicOn ? 'TON AN' : 'TON AUS';
    document.getElementById('musicBtn').textContent = gameState.musicOn ? 'TON AN' : 'TON AUS';

    //Müzigi ac ya da kapat
    if(gameState.musicOn) {
        if(gameState.started && !gameState.paused) {  // Ses açık: Müziği başlat veya devam ettir
            startBackgroundMusic();
    } else {
        pauseBackgroundMusic();
        }
    }
}

//Tam ekran aç/kapat (VOLLBILD butonu)
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
    //Alle Button-Elemente aus dem DOM holen
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnjump = document.getElementById('btnJump');
    const btnThrow = document.getElementById('btnThrow');

    //Wenn Buttons nicht existieren, Funktion beenden
    if(!btnLeft) return;

    //LINKS_BUTTON
    /**
     * Touch-Start Event: Linke Bewegung aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern (Scrollen, Zoomen)
        keyboard.LEFT = true; // Linke Taste aktivieren
    });
    
    /**
     * Touch-Ende Event: Linke Bewegung deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnLeft.addEventListener('touchend', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.LEFT = false; // Linke Taste deaktivieren
    });
    
    // ===== RECHTS-BUTTON =====
    /**
     * Touch-Start Event: Rechte Bewegung aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.RIGHT = true; // Rechte Taste aktivieren
    });
    
    /**
     * Touch-Ende Event: Rechte Bewegung deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnRight.addEventListener('touchend', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.RIGHT = false; // Rechte Taste deaktivieren
    });
    
    // ===== SPRUNG-BUTTON =====
    /**
     * Touch-Start Event: Sprung aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.SPACE = true; // Leertaste aktivieren (Sprung)
    });
    
    /**
     * Touch-Ende Event: Sprung deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnJump.addEventListener('touchend', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.SPACE = false; // Leertaste deaktivieren
    });
    
    // ===== WURF-BUTTON =====
    /**
     * Touch-Start Event: Wurf aktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnThrow.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.D = true; // D-Taste aktivieren (Flasche werfen)
    });
    
    /**
     * Touch-Ende Event: Wurf deaktivieren
     * @param {TouchEvent} e - Das Touch-Event-Objekt
     */
    btnThrow.addEventListener('touchend', (e) => {
        e.preventDefault(); // Standard-Touch-Verhalten verhindern
        keyboard.D = false; // D-Taste deaktivieren
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
    
    // Nur auf mobilen Geräten anzeigen (Bildschirmbreite <= 1024px)
    if (mobilControls && window.innerWidth <= 1024) {
        mobilControls.style.display = 'flex'; // Steuerung sichtbar machen
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

// ===== EVENT-LISTENER =====

/**
 * Initialisiert die mobilen Steuerungen beim Laden der Seite
 * Dieser Event-Listener stellt sicher, dass die Touch-Steuerungen
 * bereit sind, sobald die Seite vollständig geladen ist
 */
window.addEventListener('load', () => {
    setupMobilControls(); // Mobile Steuerung einrichten
});

/**
 * Level-Auswahlfunktion
 * @param {number} levelNumber - Die ausgewählte Level-Nummer
 */
function selectLevel(levelNumber) {
    if (levelNumber === 1) {
        // Entferne die "active"-Klasse von allen Buttons
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Füge die "active"-Klasse zum angeklickten Button hinzu
        event.target.classList.add('active');
        console.log('Level ' + levelNumber + ' ausgewählt');
    }
}