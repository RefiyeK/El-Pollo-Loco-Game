let canvas;
let world;
let keyboard = new Keyboard();

let gameState = {
    started : false,// Oyun başladı mı?
    paused : false,// Oyun duraklatıldı mı?
    gameOver : false,// Oyun bitti mi?
    musicOn : true,// Müzik açık mı?
};


function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    
    console.log('My Character is', world.character); //Karakterim hareket eden bir karakter
    setupButtonListeners(); //Butonlari etkinlestir

    // Butonlar yüklenene kadar bekle
    setTimeout(function() {
        setupButtonListeners();
    }, 100);
    
}

window.addEventListener("keydown", (e) => {
    if(e.keyCode == 39) {
        keyboard.RIGHT = true;
        gameState.started = true;
    }
    if(e.keyCode == 37) {
        keyboard.LEFT = true;
        gameState.started = true;
    }
    if(e.keyCode == 40) {
        keyboard.DOWN = true;
        gameState.started = true;
    }
    if(e.keyCode == 38) {
        keyboard.UP = true;
        gameState.started = true;
    }
    if(e.keyCode == 32) {
        keyboard.SPACE = true;
        gameState.started = true;
    }
    if(e.keyCode == 68) {
        keyboard.D = true;
        gameState.started = true;
    }
    console.log(e);
});

window.addEventListener("keyup", (e) => {
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
    console.log(e);
});

// ===== BUTON İŞLEVLERİ =====
function setupButtonListeners() {

    // START Butonu. Burasi oyunu yeiden baslatan butonun yeri
    document.getElementById('startBtn').addEventListener('click', function() {
        if (!gameState.started) {
            gameState.started = true;
        }
    });
    
    // PAUSE Butonu. Burasi oyunu durdurur ve "DEVAM ET" yazisina degisir
    document.getElementById('pauseBtn').addEventListener('click', function() {
        if (gameState.started && !gameState.gameOver) {
            gameState.paused = !gameState.paused;
            
            if (gameState.paused) {
                document.getElementById('pauseBtn').textContent = 'DEVAM ET';
            } else {
                document.getElementById('pauseBtn').textContent = 'PAUSE';
            }
        }
    });
    
    // MÜZİK Butonu. Müzik durumunu acip kapatir ve buton yazisi degisir
    document.getElementById('musicBtn').addEventListener('click', function() {
        gameState.musicOn = !gameState.musicOn;
        
        if (gameState.musicOn) {
            document.getElementById('musicBtn').textContent = 'MUSIK AN';
        } else {
            document.getElementById('musicBtn').textContent = 'MUSIK AUS';
        }
    });
    
    // NOCHMAL SPIELEN Butonu. Sayfayi yenileyerek oyunun bastan baslatir
    document.getElementById('restartBtn').addEventListener('click', function() {
        location.reload(); // Sayfayı yenile (oyunu baştan başlat)
    });
}