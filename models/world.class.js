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
    bottleStatusBar;
    throwableObjects = [];
    lastTime = null;
    endScreenShown = false;


    /**
     * Creates a new game world
     * @param {HTMLCanvasElement} canvas - The canvas element
     * @param {Keyboard} keyboard - The keyboard object for controls
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = createLevel1();
        this.character = new Character();
        this.statusBar = new StatusBar();
        this.coinStatusBar = new CoinStatusBar();
        this.bossStatusBar = new BossStatusBar();
        this.bossStatusBar.visible = false;
        this.bottleStatusBar = new BottleStatusBar();
        this.setWorld();
        requestAnimationFrame((ts) => this.draw(ts));
    }


    /**
     * Connects world reference to character and endboss
     * Endboss needs world to check character distance
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.world = this;
            }
        });
    }


    /**
     * Calculates deltaTime and drives all game updates
     * Cap at 50ms prevents huge jumps after tab switch
     * @param {number} timestamp - rAF timestamp
     */
    tick(timestamp) {
        const deltaTime = this.lastTime
            ? Math.min(timestamp - this.lastTime, 50)
            : 1000 / 60;
        this.lastTime = timestamp;
        this.updateGameObjects(deltaTime);
        this.updateGameLogic();
    }


    /**
     * Updates physics and animation for all active objects
     * @param {number} deltaTime - Milliseconds since last frame
     */
    updateGameObjects(deltaTime) {
        this.character.updateGravity(deltaTime);
        this.character.update(deltaTime);

        this.level.enemies.forEach((enemy) => {
            if (enemy.hasGravity) enemy.updateGravity(deltaTime);
            if (enemy.update)     enemy.update(deltaTime);
        });

        this.level.clouds.forEach((c) => c.update(deltaTime));
        this.level.coins.forEach((c)  => c.update(deltaTime));

        this.throwableObjects.forEach((b) => {
            if (b.hasGravity) b.updateGravity(deltaTime);
            b.update(deltaTime);
        });
    }


    /**
     * Runs all game logic checks each frame
     */
    updateGameLogic() {
        this.checkThrowObjects();
        this.checkCollisions();
        this.checkBottleCollision();
        this.removeFinishedBottles();
        this.checkGameState();
    }


    /**
     * Checks win/lose conditions — guarded against repeated calls
     * Uses else-if to prevent win + lose triggering on same frame
     */
    checkGameState() {
        if (gameState.paused) return;
        const endboss = this.level.enemies.find((e) => e instanceof Endboss);
        if (endboss && endboss.isDead()) {
            gameState.won = true;
            this.showGameOver();
        } else if (gameState.gameOver) {
            this.showGameOver();
        }
    }


    /**
     * Checks if a bottle should be thrown
     * Creates new ThrowableObject when D pressed and bottles available
     */
    checkThrowObjects() {
        const COOLDOWN = 500;
        const canThrow = this.keyboard.D
            && this.character.bottles > 0
            && (Date.now() - this.character.lastThrow) > COOLDOWN;

        if (!canThrow) return;

        const direction = this.character.otherDirection ? -1 : 1;
        const bottleX = this.character.otherDirection
            ? this.character.x - 50
            : this.character.x + 100;

        this.throwableObjects.push(
            new ThrowableObject(bottleX, this.character.y + 100, direction)
        );
        this.character.bottles -= 1;
        this.bottleStatusBar.setBottles(this.character.bottles);
        this.character.lastThrow = Date.now();
    }


    /**
     * Extracts collision geometry shared between jump- and damage-collision checks
     * Avoids duplicating the same 5 offset calculations in two places
     * @param {Object} enemy - The enemy to calculate geometry for
     * @returns {{ charBottom: number, enemyTop: number, enemyBottom: number }}
     */
    getEnemyCollisionGeometry(enemy) {
        const charOffset  = this.character.getCollisionOffset();
        const enemyOffset = enemy.offset || { top: 0, bottom: 0, left: 0, right: 0 };
        const charBottom  = this.character.y + this.character.height - charOffset.bottom;
        const enemyTop    = enemy.y + enemyOffset.top;
        const enemyBottom = enemy.y + enemy.height - enemyOffset.bottom;
        return { charBottom, enemyTop, enemyBottom };
    }


    /**
     * Returns true when character is landing on top of an enemy
     * @param {{ charBottom, enemyTop, enemyBottom }} geo - Collision geometry
     * @returns {boolean}
     */
    isLandingOnTop(geo) {
        const { charBottom, enemyTop, enemyBottom } = geo;
        const isFalling   = this.character.speedY < 0;
        const isAboveMid  = charBottom < (enemyTop + enemyBottom) / 2;
        const isUpperHalf = charBottom < enemyTop + (enemyBottom - enemyTop) * 0.6;
        return isFalling && isAboveMid && isUpperHalf;
    }


    /**
     * Checks if character jumps on top of enemies
     */
    checkEnemyJumpCollision() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss || enemy.isDead()) return;
            if (!this.character.isColliding(enemy)) return;

            const geo = this.getEnemyCollisionGeometry(enemy);
            if (this.isLandingOnTop(geo)) {
                this.handleEnemyJumpKill(enemy);
            }
        });
    }


    /**
     * Handles killing an enemy by jumping on it
     * @param {Object} enemy - The enemy to kill
     */
    handleEnemyJumpKill(enemy) {
        enemy.energy = 0;
        this.character.speedY = 15;

        if (enemy instanceof Chicken)     AudioHub.playSound(AudioHub.chicken_sound, 0.2);
        if (enemy instanceof ChickenBaby) AudioHub.playSound(AudioHub.chicken_baby_sound, 0.2);

        setTimeout(() => {
            const index = this.level.enemies.indexOf(enemy);
            if (index > -1) this.level.enemies.splice(index, 1);
        }, 500);
    }


    /**
     * Checks coin collection collisions
     */
    checkCoinCollision() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.coins[i])) {
                this.collectCoin(this.level.coins[i]);
            }
        }
    }


    /**
     * Collects a coin and updates status bar
     * @param {Object} coin - The coin to collect
     */
    collectCoin(coin) {
        this.character.collectCoin();
        this.coinStatusBar.setPercentage(this.character.coins);
        AudioHub.playSound(AudioHub.coin_sound, 0.2);
        const index = this.level.coins.indexOf(coin);
        if (index > -1) this.level.coins.splice(index, 1);
    }


    /**
     * Checks bottle pickup collisions
     */
    checkBottlePickupCollision() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            const bottle = this.level.bottles[i];
            if (!this.character.isColliding(bottle)) continue;
            if (this.character.bottles >= 10 || bottle.isCollected) continue;

            bottle.isCollected = true;
            this.character.collectBottle();
            this.bottleStatusBar.setBottles(this.character.bottles);
            this.level.bottles.splice(i, 1);
        }
    }


    /**
     * Applies one hit of damage to the character and updates UI
     * Sets gameOver when energy reaches zero
     */
    applyDamageToCharacter(enemy) {
        const damage = enemy instanceof ChickenBaby ? 10
                 : enemy instanceof Endboss     ? 25
                 : 20;
    this.character.energy = Math.max(0, this.character.energy - damage);
    this.character.lastHit = Date.now();
    this.statusBar.setPercentage(this.character.energy);
    AudioHub.playSound(AudioHub.hurt_sound, 0.3);
    if (this.character.energy <= 0) gameState.gameOver = true;
    }


    /**
     * Checks if character takes damage from enemies
     * 100ms lastHit guard prevents rapid-fire damage within one collision
     */
    checkEnemyDamageCollision() {
        if (Date.now() - this.character.lastHit < 1000) return;

        for (const enemy of this.level.enemies) {
            if (enemy.isDead()) continue;
            if (!this.character.isColliding(enemy)) continue;

            const geo = this.getEnemyCollisionGeometry(enemy);
            if (this.isLandingOnTop(geo) && !(enemy instanceof Endboss)) continue;

            this.applyDamageToCharacter(enemy);
            break;
        }
    }


    /**
     * Runs all collision checks
     */
    checkCollisions() {
        this.checkEnemyJumpCollision();
        this.checkCoinCollision();
        this.checkBottlePickupCollision();
        this.checkEnemyDamageCollision();
        this.checkBossProximity();
    }


    /**
     * Shows or hides boss health bar based on distance
     */
    checkBossProximity() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss)) return;
            const distance = Math.abs(this.character.x - enemy.x);
            this.bossStatusBar.visible = distance < 500;
        });
    }


    /**
     * Updates camera position to follow character
     */
    updateCameraPosition() {
        if (this.character.otherDirection) {
            this.camera_x = Math.round(-this.character.x + 550);
        } else {
            this.camera_x = Math.round(-this.character.x + 100);
        }
    }


    /**
     * Draws all world objects with camera offset
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
     * Draws all fixed HUD elements
     */
    drawFixedUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.coinStatusBar);
        this.addToMap(this.bottleStatusBar);
        if (this.bossStatusBar.visible) this.addToMap(this.bossStatusBar);
    }


    /**
     * Main game loop — called every frame via requestAnimationFrame
     * @param {number} timestamp - rAF high-resolution timestamp
     */
    draw(timestamp) {
        if (gameState && (gameState.paused || gameState.gameOver)) {
            this.rafId = requestAnimationFrame((ts) => this.draw(ts));
            return;
        }

        this.tick(timestamp);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCameraPosition();
        this.drawMovableObjects();
        this.drawFixedUI();

        this.rafId = requestAnimationFrame((ts) => this.draw(ts));
    }


    /**
     * Adds multiple objects to the canvas
     * @param {Array} objects - Array of drawable objects
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => this.addToMap(o));
    }


    /**
     * Draws a single object — handles horizontal mirroring
     * @param {Object} mo - The drawable object
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }


    /**
     * Mirrors canvas context horizontally for flipped objects
     * @param {Object} mo - Object to mirror
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }


    /**
     * Restores canvas context after mirroring
     * @param {Object} mo - Object to restore
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }


    /**
     * Shows the lose screen and plays lose sound
     */
    showLoseScreen() {
        document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20lost%20b.png';
        document.getElementById('gameOverText').textContent = 'YOU LOST!';
        stopBackgroundMusic();
        AudioHub.playSound(AudioHub.lost_sound, 0.4);
    }


    /**
     * Shows the win screen and plays win sound
     */
    showWinScreen() {
        document.getElementById('winImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
        document.getElementById('winText').textContent = 'YOU WON!';
        stopBackgroundMusic();
        AudioHub.playSound(AudioHub.win_sound, 0.4);
    }


    /**
     * Decides and shows game over or win panel
     * endScreenShown flag prevents audio/DOM calls from firing multiple times
     */
    showGameOver() {
        if (this.endScreenShown) return;
        this.endScreenShown = true;

        if (gameState.gameOver && this.character.isDead()) {
            document.getElementById('gameOverPanel').style.display = 'block';
            this.showLoseScreen();
        } else if (gameState.won) {
            document.getElementById('winPanel').style.display = 'block';
            this.showWinScreen();
        }
        gameState.paused = true;
    }


    /**
     * Handles bottle hit on endboss
     * @param {Object} enemy - The endboss
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
        if (enemy instanceof Chicken)     AudioHub.playSound(AudioHub.chicken_sound, 0.2);
        if (enemy instanceof ChickenBaby) AudioHub.playSound(AudioHub.chicken_baby_sound, 0.2);

        setTimeout(() => {
            const index = this.level.enemies.indexOf(enemy);
            if (index > -1) this.level.enemies.splice(index, 1);
        }, 500);
    }


    /**
     * Processes a bottle-enemy collision
     * @param {Object} bottle - The thrown bottle
     * @param {Object} enemy - The enemy
     */
    processBottleEnemyCollision(bottle, enemy) {
        if (!bottle.isColliding(enemy) || bottle.isSplashed) return;

        bottle.splash();
        if (enemy instanceof Endboss) {
            this.handleEndbossHit(enemy);
        } else {
            this.handleNormalEnemyHit(enemy);
        }

        setTimeout(() => {
            const index = this.throwableObjects.indexOf(bottle);
            if (index > -1) this.throwableObjects.splice(index, 1);
        }, 600);
    }


    /**
     * Checks all bottle-enemy collisions
     */
    checkBottleCollision() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.processBottleEnemyCollision(bottle, enemy);
            });
        });
    }


    /**
     * Removes bottles marked for removal
     */
    removeFinishedBottles() {
        this.throwableObjects = this.throwableObjects.filter((b) => !b.canBeRemoved);
    }


    /**
     * Stops the game loop by cancelling the pending rAF
     */
    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

}