class World {
    character;
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar;
    coinStatusBar;
    bossStatusBar;
    throwableObjects = [];


 /**
 * Erstellt eine neue Spielwelt
 * @param {HTMLCanvasElement} canvas - Das Canvas-Element
 * @param {Keyboard} keyboard - Das Keyboard-Objekt für Steuerung
 */
constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = createLevel1();
    this.character = new Character();
    this.statusBar = new StatusBar();
    this.coinStatusBar = new CoinStatusBar();
    this.bossStatusBar = new BossStatusBar();
    this.bottleStatusBar = new BottleStatusBar();
    this.camera_target = 0;
    this.smoothCamera = 0;
    this.setWorld();
    this.draw();
    this.run();
}


/**
 * Verbindet die Welt mit dem Charakter und Feinden
 * Startet Endboss-Animation
 */
setWorld() {        
    this.character.world = this;
       this.level.enemies.forEach((enemy) => {
        if(enemy instanceof Endboss) {
            enemy.world = this;
            enemy.animate();
        }
    });
}


/**
 * Startet das Kollisions-Intervall
 * Prüft alle 200ms auf Kollisionen und Spielende
 */
startCollisionInterval() {
    const collisionInterval = setInterval(() => {
        if(!isGameActive()) return;

        this.checkCollisions();
        this.checkThrowObjects();
        this.removeFinishedBottles();

        if(gameState.gameOver) {
            this.showGameOver();
        }

        if(this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.isDead)) {
            gameState.won = true;
            this.showGameOver();
        }
    }, 200);
        
    intervalIds.push(collisionInterval);
}


/**
 * Startet das Flaschen-Kollisions-Intervall
 * Prüft 60x pro Sekunde auf Flaschentreffer
 */
startBottleInterval() {
    const bottleInterval = setInterval(() => {
        if(!isGameActive()) return;
        this.checkBottleCollision();
    }, 1000 / 60);
        
    intervalIds.push(bottleInterval);
}


/**
 * Startet die Spiel-Logik
 * Initialisiert alle Game-Loop-Intervalle
 */
run() {
    this.startCollisionInterval();
    this.startBottleInterval();
}


/**
 * Prüft ob eine Flasche geworfen werden soll
 * Erstellt neues Wurfobjekt wenn D gedrückt und Flaschen verfügbar
 */
checkThrowObjects() {
    if(this.keyboard.D && this.character.bottles > 0) {
        let direction = this.character.otherDirection ? -1 : 1;

        let bottleX;
        if(this.character.otherDirection) {
            bottleX= this.character.x - 50;
        }else {
            bottleX = this.character.x + 100;
        }

        let bottle = new ThrowableObject(bottleX, this.character.y +100, direction);
        this.throwableObjects.push(bottle);

        this.character.bottles -= 1;
        this.bottleStatusBar.setBottles(this.character.bottles);
    }
}


/**
 * Prüft ob Charakter auf Feinde springt
 * Tötet Feinde bei Sprung-Kollision
 */
checkEnemyJumpCollision() {
    this.level.enemies.forEach((enemy) => {
        if(enemy instanceof Endboss || enemy.isDead) {
            return;
        }
            
        if(this.character.isAboveGround() && 
           this.character.speedY < 0 && 
           this.character.isColliding(enemy)) {
            this.handleEnemyJumpKill(enemy);
        }
    });
}


/**
 * Behandelt das Töten eines Feindes durch Sprung
 * @param {Object} enemy - Der getötete Feind
 */
handleEnemyJumpKill(enemy) {
    enemy.isDead = true;
        
    if(enemy instanceof Chicken) {
        AudioHub.chicken_sound.currentTime = 0;
        AudioHub.chicken_sound.volume = 0.2;
        AudioHub.chicken_sound.play();
    }
        
    if(enemy instanceof ChickenBaby) {
        AudioHub.chicken_baby_sound.currentTime = 0;
        AudioHub.chicken_baby_sound.play();
    }
        
    let index = this.level.enemies.indexOf(enemy);
    if(index > -1) {
        this.level.enemies.splice(index, 1);
    }
    this.character.speedY = 15;
}

/**
 * Prüft Kollision mit Münzen
 * Sammelt Münzen wenn Charakter sie berührt
 */
checkCoinCollision() {
    this.level.coins.forEach((coin) => {
        if(!this.character.isColliding(coin)) {
            return;
        }
            
        let coinIsHigh = coin.y < 350;
        let characterIsJumping = this.character.isAboveGround();
            
        if(coinIsHigh && !characterIsJumping) {
            return;
        }
            
        this.collectCoin(coin);
    });
}

/**
 * Sammelt eine Münze ein
 * @param {Object} coin - Die eingesammelte Münze
 */
collectCoin(coin) {
    this.character.collectCoin();
    this.coinStatusBar.setPercentage(this.character.coins);
        
    AudioHub.coin_sound.currentTime = 0;
    AudioHub.coin_sound.volume = 0.2;
    AudioHub.coin_sound.play().catch((e) => {
        console.warn("Münzen-Sound konnte nicht abgespielt werden:", e);
    });
        
    let index = this.level.coins.indexOf(coin);
    if(index > -1) {
        this.level.coins.splice(index, 1);
    }
}

/**
 * Prüft Kollision mit Flaschen zum Aufsammeln
 */
checkBottlePickupCollision() {
    for(let i = this.level.bottles.length - 1; i >= 0; i--) {
        let bottle = this.level.bottles[i];
            
        if(this.character.isColliding(bottle) && 
           this.character.bottles < 10 && 
           !bottle.isCollected) {
            bottle.isCollected = true;
            this.character.collectBottle();
            this.bottleStatusBar.setBottles(this.character.bottles);
            this.level.bottles.splice(i, 1);
        }
    }
}

/**
 * Prüft Kollision mit Feinden (Schaden)
 * Charakter verliert Energie bei Berührung
 */
checkEnemyDamageCollision() {
    this.level.enemies.forEach((enemy) => {
        if(this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            
            AudioHub.hurt_sound.currentTime = 0;
            AudioHub.hurt_sound.volume = 0.3;
            AudioHub.hurt_sound.play().catch((e) => {
                console.warn("Schaden-Sound konnte nicht abgespielt werden:", e);
            });
                
            if(this.character.isDead()) {
                gameState.gameOver = true;
            }
        }
    });
}


/**
 * Prüft alle Kollisionen im Spiel
 * Koordiniert verschiedene Kollisions-Checks
 */
checkCollisions() {
    this.checkEnemyJumpCollision();
    this.checkCoinCollision();
    this.checkBottlePickupCollision();
    this.checkEnemyDamageCollision();
}


/**
 * Berechnet die Kamera-Position basierend auf Charakter
 */
updateCameraPosition() {
    if(this.character.otherDirection) {
        this.camera_x = Math.round(-this.character.x + 550);
    } else {
        this.camera_x = Math.round(-this.character.x + 100);
    }
}


/**
 * Zeichnet alle beweglichen Spielobjekte
 * Wird mit Kamera-Verschiebung gezeichnet
 */
drawMovableObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);
}


/**
 * Zeichnet alle festen UI-Elemente
 * Wird ohne Kamera-Verschiebung gezeichnet
 */
drawFixedUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bossStatusBar);
    this.addToMap(this.bottleStatusBar);
}


/**
 * Zeichnet das gesamte Spiel
 * Wird kontinuierlich aufgerufen (Game Loop)
 */
draw() {
    if(gameState && (gameState.paused || gameState.gameOver)) {
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
        return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateCameraPosition();
    this.drawMovableObjects();
    this.drawFixedUI();
        
    let self = this;
    requestAnimationFrame(function() {
        self.draw();
    });
}


/**
 * Fügt mehrere Objekte zur Map hinzu
 * @param {Array} objects - Array von Spielobjekten
 */
addObjectsToMap(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
}


/**
 * Fügt ein einzelnes Objekt zur Map hinzu
 * Behandelt Spiegelung für gedrehte Objekte
 * @param {Object} mo - Das Spielobjekt (Movable Object)
 */
addToMap(mo) {
    if(mo.otherDirection) {
        this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if(mo.otherDirection) {
        this.flipImageBack(mo);
    }
}


/**
 * Spiegelt ein Bild horizontal
 * @param {Object} mo - Das zu spiegelnde Objekt
 */
flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}


 /**
 * Macht die Bild-Spiegelung rückgängig
 * @param {Object} mo - Das Objekt dessen Spiegelung rückgängig gemacht wird
 */
flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
}


/**
 * Zeigt den Verloren-Bildschirm an
 * Spielt Verloren-Sound ab
 */
showLoseScreen() {
    document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20lost%20b.png';
    document.getElementById('gameOverText').textContent = 'DU HAST VERLOREN!';
        
    stopBackgroundMusic();
    AudioHub.lost_sound.currentTime = 0;
    AudioHub.lost_sound.volume = 0.4;
    AudioHub.lost_sound.play().catch((e) => {
        console.warn("Verloren-Sound konnte nicht abgespielt werden:", e);
    });
}


/**
 * Zeigt den Gewonnen-Bildschirm an
 * Spielt Gewinn-Sound ab
 */
showWinScreen() {
    document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
    document.getElementById('gameOverText').textContent = 'DU HAST GEWONNEN!';
        
    stopBackgroundMusic();
    AudioHub.win_sound.currentTime = 0;
    AudioHub.win_sound.volume = 0.4;
    AudioHub.win_sound.play().catch((e) => {
        console.warn("Gewinn-Sound konnte nicht abgespielt werden:", e);
    });
}

    
/**
 * Zeigt Game-Over oder Gewinn-Bildschirm an
 * Entscheidet basierend auf Spielstatus
 */
showGameOver() {
    document.getElementById('gameOverPanel').style.display = 'block';
    
    if(gameState.gameOver && this.character.isDead()) {
        this.showLoseScreen();
    } else if(gameState.won) {
        this.showWinScreen();
    }
    
    gameState.paused = true;
}
        

/**
 * Behandelt Flaschen-Treffer auf Endboss
 * @param {Object} enemy - Der getroffene Endboss
 */
handleEndbossHit(enemy) {
    enemy.takeDamage(20);
    this.bossStatusBar.setPercentage(enemy.health);
}


/**
 * Behandelt Flaschen-Treffer auf normale Feinde
 * @param {Object} enemy - Der getroffene Feind
 */
handleNormalEnemyHit(enemy) {
    enemy.isDead = true;
        
    if(enemy instanceof Chicken) {
        AudioHub.chicken_sound.currentTime = 0;
        AudioHub.chicken_sound.volume = 0.2;
        AudioHub.chicken_sound.play();
    }
        
    if(enemy instanceof ChickenBaby) {
       AudioHub.chicken_baby_sound.currentTime = 0;
        AudioHub.chicken_baby_sound.volume = 0.2;
        AudioHub.chicken_baby_sound.play();
    }
        
    setTimeout(() => {
        let enemyIndex = this.level.enemies.indexOf(enemy);
        if(enemyIndex > -1) {
            this.level.enemies.splice(enemyIndex, 1);
        }
    }, 500);
}


/**
 * Verarbeitet Kollision zwischen Flasche und Feind
 * @param {Object} bottle - Die geworfene Flasche
 * @param {Object} enemy - Der getroffene Feind
 */
processBottleEnemyCollision(bottle, enemy) {
    if(!bottle.isColliding(enemy) || bottle.isSplashed) {
        return;
    }
        
    bottle.splash();
        
    if(enemy instanceof Endboss) {
        this.handleEndbossHit(enemy);
    } else {
        this.handleNormalEnemyHit(enemy);
    }
        
    setTimeout(() => {
        let bottleIndex = this.throwableObjects.indexOf(bottle);
        if(bottleIndex > -1) {
            this.throwableObjects.splice(bottleIndex, 1);
        }
    }, 600);
}


/**
     * Prüft Kollision zwischen geworfenen Flaschen und Feinden
     * Verarbeitet Treffer und entfernt getroffene Objekte
     */
    checkBottleCollision() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.processBottleEnemyCollision(bottle, enemy);
            });
        });
    }


removeFinishedBottles() {
    this.throwableObjects = this.throwableObjects.filter(bottle => {
        return !bottle.canBeRemoved;
        });
    }
}   
