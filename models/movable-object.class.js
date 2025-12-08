class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    

    /**
     * Applies gravity to the object
     * Object falls down when in the air
     */
    applyGravity() { 
        setInterval(() => {
            if(!isGameActive()) return;

           if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
           }
        }, 1000 / 25);
    }


    /**
     * Checks if object is above ground
     * @returns {boolean} True if above ground
     */
    isAboveGround() {
        if(this instanceof ThrowableObject) {
            return this.y < 360;
        } 
        if(this instanceof Coin) {
        return this.y < 150
         }
         return this.y < 150
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
     * Considers offset values for precise collision
     * @param {Object} mo - The other object (Movable Object)
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
     * Object takes damage
     * Reduces energy by 5 points
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    /**
     * Checks if object was just injured
     * @returns {boolean} True if hit less than 1 second ago
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
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
     * Plays an animation
     * Cycles through the given images
     * @param {Array} images - Array of image paths
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
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