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
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) enemy.world = this;
        });
    }


    /**
     * Calculates deltaTime and drives all game updates
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
     * Updates camera position to follow character
     * Clamps camera so it never scrolls past the level end
     */
    updateCameraPosition() {
        const maxCameraX = -(this.level.level_end_x - this.canvas.width);

        if (this.character.otherDirection) {
            this.camera_x = Math.round(-this.character.x + 550);
        } else {
            this.camera_x = Math.round(-this.character.x + 100);
        }

        this.camera_x = Math.max(this.camera_x, maxCameraX);
    }


    /**
     * Draws all world objects with camera offset
     */
    drawMovableObjects() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins);
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
     * Stops the game loop by cancelling the pending rAF
     */
    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

}