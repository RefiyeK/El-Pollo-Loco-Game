class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    hasGravity = false;


    /**
     * Marks the object to receive gravity updates
     * Called in constructor — actual physics in updateGravity()
     */
    applyGravity() {
        this.hasGravity = true;
    }


    /**
     * Updates gravity physics for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    updateGravity(deltaTime) {
        const factor = deltaTime / (1000 / 60);
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY * factor;
            this.speedY -= this.acceleration * factor;
        }
    }


    /**
     * Checks if object is above ground
     * @returns {boolean} True if above ground
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return this.y < 360;
        }
        return this.y < 150;
    }

    
    /**
     * Gets the offset values of an object
     * @param {Object} obj - The object
     * @returns {Object} Offset values (left, right, top, bottom)
     */
    getOffsets(obj) {
        return {
            left: obj.offset?.left || 0,
            right: obj.offset?.right || 0,
            top: obj.offset?.top || 0,
            bottom: obj.offset?.bottom || 0
        };
    }


    /**
     * Checks if this object collides with another
     * @param {Object} mo - The other object
     * @returns {boolean} True if collision occurs
     */
    isColliding(mo) {
        let thisOffset = this.getOffsets(this);
        let moOffset = this.getOffsets(mo);
        
        return (
            this.x + thisOffset.left + (this.width - thisOffset.left - thisOffset.right) > mo.x + moOffset.left &&
            this.x + thisOffset.left < mo.x + moOffset.left + (mo.width - moOffset.left - moOffset.right) &&
            this.y + thisOffset.top + (this.height - thisOffset.top - thisOffset.bottom) > mo.y + moOffset.top &&
            this.y + thisOffset.top < mo.y + moOffset.top + (mo.height - moOffset.top - moOffset.bottom)
        );
    }


    /**
     * Object takes damage — reduces energy by 2
     */
    hit() {
        this.energy -= 2;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = Date.now();
        }
    }


    /**
     * Checks if object was recently hurt
     * @returns {boolean} True if hit less than 1 second ago
     */
    isHurt() {
        let timepassed = (Date.now() - this.lastHit) / 1000;
        return timepassed < 1;
    }


    /**
     * Checks if object is dead
     * @returns {boolean} True if energy is 0
     */
    isDead() {
        return this.energy == 0;
    }


    /**
     * Plays an animation — cycles through given images
     * @param {Array} images - Array of image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        this.img = this.imageCache[images[i]];
        this.currentImage++;
    }


    /**
     * Moves object to the right
     */
    moveRight() {
        this.x += this.speed;
    }


    /**
     * Moves object to the left
     */
    moveLeft() {
        this.x -= this.speed;
    }
}