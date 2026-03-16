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
 * Creates a new game world
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Keyboard} keyboard - The keyboard object for controls
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
    this.bossStatusBar.visible = false;
    this.bottleStatusBar = new BottleStatusBar();
    // this.camera_target = 0;
    // this.smoothCamera = 0;
    this.setWorld();
    this.draw();
    this.run();
}


/**
 * Connects the world with the character and enemies
 * Starts endboss animation
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
 * Starts the collision interval
 * Checks for collisions and game end every 200ms
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
 * Starts the bottle collision interval
 * Checks for bottle hits 60 times per second
 */
startBottleInterval() {
    const bottleInterval = setInterval(() => {
        if(!isGameActive()) return;
        this.checkBottleCollision();
    }, 1000 / 60);
        
    intervalIds.push(bottleInterval);
}


/**
 * Starts the game logic
 * Initializes all game loop intervals
 */
run() {
    this.startCollisionInterval();
    this.startBottleInterval();
}


/**
 * Checks if a bottle should be thrown
 * Creates new throw object when D is pressed and bottles available
 */
checkThrowObjects() {
    const COOLDOWN_TIME = 500;
    if(this.keyboard.D && this.character.bottles > 0 && (Date.now() - this.character.lastThrow) > COOLDOWN_TIME) {
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
        this.character.lastThrow = Date.now();
    }
}


/**
 * Checks if character jumps on enemies
 * Kills enemies on jump collision - COMPLETELY REWRITTEN!
 */
checkEnemyJumpCollision() {
    this.level.enemies.forEach((enemy) => {
        // Skip endboss and already dead enemies
        if(enemy instanceof Endboss || enemy.isDead()) {
            return;
        }
        
        // Get collision boxes
        let charOffset = this.character.getCollisionOffset();
        let enemyOffset = enemy.offset || {top: 0, bottom: 0, left: 0, right: 0};
        
        // Check if they're colliding at all
        if(!this.character.isColliding(enemy)) {
            return;
        }
        
        // Calculate actual positions with offsets
        let charBottom = this.character.y + this.character.height - charOffset.bottom;
        let charTop = this.character.y + charOffset.top;
        let charLeft = this.character.x + charOffset.left;
        let charRight = this.character.x + this.character.width - charOffset.right;
        
        let enemyTop = enemy.y + enemyOffset.top;
        let enemyBottom = enemy.y + enemy.height - enemyOffset.bottom;
        let enemyLeft = enemy.x + enemyOffset.left;
        let enemyRight = enemy.x + enemy.width - enemyOffset.right;
        
        // CRITICAL: Check if Pepe is FALLING DOWN (speedY negative means falling in our physics)
        // AND if Pepe's feet are above enemy's center (jumping from above)
        let isFalling = this.character.speedY < 0;
        let isPepeAboveEnemy = charBottom < (enemyTop + enemyBottom) / 2;
        
        // Additional check: Pepe's bottom should be in the upper part of the enemy
        let pepeFeetInUpperHalf = charBottom < enemyTop + (enemyBottom - enemyTop) * 0.6;
        
        if(isFalling && isPepeAboveEnemy && pepeFeetInUpperHalf) {
            this.handleEnemyJumpKill(enemy);
        }
    });
}


/**
 * Handles killing an enemy by jumping
 * @param {Object} enemy - The killed enemy
 */
handleEnemyJumpKill(enemy) {
    enemy.energy = 0;
        
    if(enemy instanceof Chicken) {
        AudioHub.playSound(AudioHub.chicken_sound, 0.2);
    }
        
    if(enemy instanceof ChickenBaby) {
        AudioHub.playSound(AudioHub.chicken_baby_sound, 0.2);
    }
    
    // Give Pepe a small bounce after killing
    this.character.speedY = 15;
    
    // Remove enemy after short delay (for death animation)
    setTimeout(() => {
        let index = this.level.enemies.indexOf(enemy);
        if(index > -1) {
            this.level.enemies.splice(index, 1);
        }
    }, 500);
}

/**
 * Checks collision with coins
 * Collects coins when character touches them
 */
checkCoinCollision() {
    // this.level.coins.forEach((coin) => {
    //     if(this.character.isColliding(coin)) {
    //     this.collectCoin(coin);
    //     }
    // });
    for(let i = this.level.coins.length - 1; i >= 0; i--) {
        if(this.character.isColliding(this.level.coins[i])) {
            this.collectCoin(this.level.coins[i]);
        }
    }
}

/**
 * Collects a coin
 * @param {Object} coin - The collected coin
 */
collectCoin(coin) {
    this.character.collectCoin();
    this.coinStatusBar.setPercentage(this.character.coins);
        
    AudioHub.playSound(AudioHub.coin_sound, 0.2);
        
    let index = this.level.coins.indexOf(coin);
    if(index > -1) {
        this.level.coins.splice(index, 1);
    }
}

/**
 * Checks collision with bottles for pickup
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
 * Checks collision with enemies (damage)
 * Character loses energy on contact - IMPROVED with jump protection!
 */
checkEnemyDamageCollision() {
    this.level.enemies.forEach((enemy) => {
        if(!this.character.isColliding(enemy)) {
            return;
        }
        
        // Don't take damage if jumping on enemy from above
        let charOffset = this.character.getCollisionOffset();
        let enemyOffset = enemy.offset || {top: 0, bottom: 0, left: 0, right: 0};
        
        let charBottom = this.character.y + this.character.height - charOffset.bottom;
        let enemyTop = enemy.y + enemyOffset.top;
        let enemyBottom = enemy.y + enemy.height - enemyOffset.bottom;
        
        let isFalling = this.character.speedY < 0;
        let isPepeAboveEnemy = charBottom < (enemyTop + enemyBottom) / 2;
        let pepeFeetInUpperHalf = charBottom < enemyTop + (enemyBottom - enemyTop) * 0.6;
        
        // Skip damage if successfully jumping on enemy
        if(isFalling && isPepeAboveEnemy && pepeFeetInUpperHalf && !(enemy instanceof Endboss)) {
            return;
        }
        
        // Otherwise, take damage
        this.character.hit();
        
        // CRITICAL: Update health bar IMMEDIATELY with current energy
        this.statusBar.setPercentage(this.character.energy);
        
        AudioHub.playSound(AudioHub.hurt_sound, 0.3);
        
        // Check death AFTER health bar update
        if(this.character.energy <= 0) {
            this.statusBar.setPercentage(0);  // Force bar to 0
            gameState.gameOver = true;
        }
    });
}


/**
 * Checks all collisions in the game
 * Coordinates different collision checks
 */
checkCollisions() {
    this.checkEnemyJumpCollision();
    this.checkCoinCollision();
    this.checkBottlePickupCollision();
    this.checkEnemyDamageCollision();
    this.checkBossProximity();
}


/**
 * Checks if character is near the endboss
 * Shows boss health bar when close
 */
checkBossProximity() {
    this.level.enemies.forEach((enemy) => {
        if(enemy instanceof Endboss) {
            let distance = Math.abs(this.character.x - enemy.x);
            
            if(distance < 500) {
                this.bossStatusBar.visible = true;
            } else {
                this.bossStatusBar.visible = false;
            }
        }
    });
}


/**
 * Calculates camera position based on character
 */
updateCameraPosition() {
    if(this.character.otherDirection) {
        this.camera_x = Math.round(-this.character.x + 550);
    } else {
        this.camera_x = Math.round(-this.character.x + 100);
    }
}


/**
 * Draws all movable game objects
 * Drawn with camera offset
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
 * Draws all fixed UI elements
 * Drawn without camera offset
 */
drawFixedUI() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if(this.bossStatusBar.visible) {
        this.addToMap(this.bossStatusBar);
    }
}


/**
 * Draws the entire game
 * Called continuously (game loop)
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
 * Adds multiple objects to the map
 * @param {Array} objects - Array of game objects
 */
addObjectsToMap(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
}


/**
 * Adds a single object to the map
 * Handles mirroring for flipped objects
 * @param {Object} mo - The game object (Movable Object)
 */
addToMap(mo) {
    if(mo.otherDirection) {
        this.flipImage(mo);
    }
    mo.draw(this.ctx);
    // mo.drawFrame(this.ctx);

    if(mo.otherDirection) {
        this.flipImageBack(mo);
    }
}


/**
 * Mirrors an image horizontally
 * @param {Object} mo - The object to mirror
 */
flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}


 /**
 * Reverses the image mirroring
 * @param {Object} mo - The object whose mirroring is reversed
 */
flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
}


/**
 * Shows the lose screen
 * Plays lose sound
 */
showLoseScreen() {
    document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20lost%20b.png';
    document.getElementById('gameOverText').textContent = 'YOU LOST!';
        
    stopBackgroundMusic();
    AudioHub.playSound(AudioHub.lost_sound, 0.4);
}


/**
 * Shows the win screen
 * Plays win sound
 */
showWinScreen() {
    // document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
    // document.getElementById('gameOverText').textContent = 'YOU WON!';

    document.getElementById('winImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
    document.getElementById('winText').textContent = 'YOU WON!';
        
    stopBackgroundMusic();
    AudioHub.playSound(AudioHub.win_sound, 0.4);
}

    
/**
 * Shows game over or win screen
 * Decides based on game status
 */
showGameOver() {
    
    if(gameState.gameOver && this.character.isDead()) {
        document.getElementById('gameOverPanel').style.display = 'block';
        this.showLoseScreen();
    } else if(gameState.won) {
        document.getElementById('winPanel').style.display = 'block';
        this.showWinScreen();
    }
    
    gameState.paused = true;
}
        

/**
 * Handles bottle hit on endboss
 * @param {Object} enemy - The hit endboss
 */
handleEndbossHit(enemy) {
    enemy.takeDamage(20);
    this.bossStatusBar.setPercentage(enemy.health);
}


/**
 * Handles bottle hit on normal enemies
 * @param {Object} enemy - The hit enemy
 */
handleNormalEnemyHit(enemy) {
    enemy.energy = 0;
    
    if(enemy instanceof Chicken) {
        AudioHub.playSound(AudioHub.chicken_sound, 0.2);
    }
        
    if(enemy instanceof ChickenBaby) {
        AudioHub.playSound(AudioHub.chicken_baby_sound, 0.2);
    }
        
    setTimeout(() => {
        let enemyIndex = this.level.enemies.indexOf(enemy);
        if(enemyIndex > -1) {
            this.level.enemies.splice(enemyIndex, 1);
        }
    }, 500);
}


/**
 * Processes collision between bottle and enemy
 * @param {Object} bottle - The thrown bottle
 * @param {Object} enemy - The hit enemy
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
 * Checks collision between thrown bottles and enemies
 * Processes hits and damage for each collision
 */
checkBottleCollision() {
    this.throwableObjects.forEach((bottle) => {
        this.level.enemies.forEach((enemy) => {
            this.processBottleEnemyCollision(bottle, enemy);
        });
    });
}


/**
 * Removes finished bottles from the game
 * Filters out bottles marked for removal
 */
removeFinishedBottles() {
    this.throwableObjects = this.throwableObjects.filter(bottle => {
        return !bottle.canBeRemoved;
    });
}
}