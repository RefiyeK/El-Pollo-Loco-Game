class BaseChicken extends MovableObject {

    animationTimer = 0;
    ANIMATION_INTERVAL = 200;


    /**
     * Updates movement and animation for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    update(deltaTime) {
        this.updateMovement();
        this.updateAnimation(deltaTime);
    }


    /**
     * Moves chicken left while alive
     */
    updateMovement() {
        if (this.isDead()) return;
        this.moveLeft();
        this.otherDirection = false;
    }


    /**
     * Updates animation frame based on elapsed time
     * @param {number} deltaTime - Milliseconds since last frame
     */
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer < this.ANIMATION_INTERVAL) return;
        this.animationTimer = 0;

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }


    /**
     * Kills the chicken instantly on hit
     */
    hit() {
        this.energy = 0;
    }


    /**
     * Checks if chicken is dead
     * @returns {boolean} True if energy is 0
     */
    isDead() {
        return this.energy === 0;
    }
}