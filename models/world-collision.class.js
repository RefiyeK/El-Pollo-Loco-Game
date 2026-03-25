Object.assign(World.prototype, {

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
    },


    /**
     * Extracts collision geometry shared between jump- and damage-collision checks
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
    },


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
    },


    /**
     * Checks if character jumps on top of enemies
     */
    checkEnemyJumpCollision() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss || enemy.isDead()) return;
            if (!this.character.isColliding(enemy)) return;

            const geo = this.getEnemyCollisionGeometry(enemy);
            if (this.isLandingOnTop(geo)) this.handleEnemyJumpKill(enemy);
        });
    },


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
    },


    /**
     * Checks coin collection collisions
     */
    checkCoinCollision() {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            if (this.character.isColliding(this.level.coins[i])) {
                this.collectCoin(this.level.coins[i]);
            }
        }
    },


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
    },


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
    },


    /**
     * Applies one hit of damage to the character and updates UI
     * @param {Object} enemy - The enemy dealing damage
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
    },


    /**
     * Checks if character takes damage from enemies
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
    },


    /**
     * Runs all collision checks
     */
    checkCollisions() {
        this.checkEnemyJumpCollision();
        this.checkCoinCollision();
        this.checkBottlePickupCollision();
        this.checkEnemyDamageCollision();
        this.checkBossProximity();
    },


    /**
     * Shows or hides boss health bar based on distance
     */
    checkBossProximity() {
        this.level.enemies.forEach((enemy) => {
            if (!(enemy instanceof Endboss)) return;
            const distance = Math.abs(this.character.x - enemy.x);
            this.bossStatusBar.visible = distance < 500;
        });
    },


    /**
     * Handles bottle hit on endboss
     * @param {Object} enemy - The endboss
     */
    handleEndbossHit(enemy) {
        enemy.takeDamage(20);
        this.bossStatusBar.setPercentage(enemy.health);
    },


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
    },


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
    },


    /**
     * Checks all bottle-enemy collisions
     */
    checkBottleCollision() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                this.processBottleEnemyCollision(bottle, enemy);
            });
        });
    },


    /**
     * Removes bottles marked for removal
     */
    removeFinishedBottles() {
        this.throwableObjects = this.throwableObjects.filter((b) => !b.canBeRemoved);
    }

});