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
   
    setupButtonListeners(); //Butonlari etkinlestir

    // // Butonlar yüklenene kadar bekle
    // setTimeout(function() {
    //     setupButtonListeners();
    // }, 100);
    
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

    document.getElementById('playBtn').addEventListener('click', function() {
        document.getElementById('homeScreen').style.display = 'none'; // Ana sayfa panelini gizle
        gameState.started = true; //oyunu baslatir ve hersey hareket etmeye baslar
    });

    //TON AN Butonu (Ana Sayfa)
    document.getElementById('soundBtn').addEventListener('click', function() {
        gameState.musicOn = !gameState.musicOn; //müzik durumunu tersine cevirir aciksa kapat/kapaliysa ac

        if(gameState.musicOn) { //Müzik aciksa 
            document.getElementById('soundBtn').textContent = 'TON AN'; //buton yazisi böyle olsun
        } else { //aksi takdirde
            document.getElementById('soundBtn').textContent = 'TON AUS'; //böyle yaz
        }
    });

    //VOLLBILD Butonu (Ana Sayfa)
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        let elem = document.documentElement; //sayfanin en dis kismini al /documentElement
        if(elem.requestFullscreen) { //Tam ekran moduna gir
            elem.requestFullscreen(); //sayfayi tam ekranda göster
        }
    });

    document.getElementById('homeBtn').addEventListener('click', function() {
        // Oyun durumunu sıfırla
        gameState.started = false;
        gameState.paused = false;
        gameState.gameOver = false;
        gameState.musicOn = true;

        //GAME OVER panelini kapat
        document.getElementById('gameOverPanel').style.display = 'none';

        //sayfayi yenile
        location.reload();
    });

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
                document.getElementById('pauseBtn').textContent = 'WEITER';
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