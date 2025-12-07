class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    

    /**
     * Wendet Schwerkraft auf das Objekt an
     * Objekt fällt nach unten wenn in der Luft
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
     * Prüft ob Objekt über dem Boden ist
     * @returns {boolean} True wenn über dem Boden
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
     * Holt die Offset-Werte eines Objekts
     * @param {Object} obj - Das Objekt
     * @returns {Object} Offset-Werte (left, right, top, bottom)
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
     * Prüft ob dieses Objekt mit einem anderen kollidiert
     * Berücksichtigt Offset-Werte für präzise Kollision
     * @param {Object} mo - Das andere Objekt (Movable Object)
     * @returns {boolean} True bei Kollision
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
     * Objekt nimmt Schaden
     * Reduziert Energie um 5 Punkte
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
     * Prüft ob Objekt gerade verletzt wurde
     * @returns {boolean} True wenn vor weniger als 1 Sekunde getroffen
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }


    /**
     * Prüft ob Objekt tot ist
     * @returns {boolean} True wenn Energie 0 ist
     */
    isDead() {
        return this.energy == 0;  
    }
   

    /**
     * Spielt eine Animation ab
     * Wechselt durch die angegebenen Bilder
     * @param {Array} images - Array von Bild-Pfaden
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }


   /**
     * Bewegt Objekt nach rechts
     */
    moveRight() {
        this.x += this.speed;
    }

    
    /**
     * Bewegt Objekt nach links
     */
    moveLeft() {
        this.x -= this.speed;
    }
}

