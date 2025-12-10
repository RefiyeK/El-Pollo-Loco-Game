class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 320;
    height = 120;
    width = 100;

    
     /**
     * Loads a single image
     * @param {string} path - Path to the image
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    draw(ctx) {
        if(this.img && this.img.complete && this.loadImage.naturalHeight !== 0) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }


    /**
     * Determines the frame color based on object type
     * @returns {string} Color for the debug frame
     */
    getFrameColor() {
        if(this instanceof Character) return 'blue';
        if(this instanceof Chicken || this instanceof ChickenBaby) return 'red';
        if(this instanceof ThrowableObject) return 'green';
        if(this instanceof Endboss) return 'orange';
        return 'white';
    }


    /**
     * Calculates the frame coordinates with offset
     * @returns {Object} Frame coordinates {x, y, width, height}
     */
    getFrameCoordinates() {
        if(this.offset) {
            return {
                x: this.x + this.offset.left,
                y: this.y + this.offset.top,
                width: this.width - this.offset.left - this.offset.right,
                height: this.height - this.offset.top - this.offset.bottom
            };
        }
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }


    /**
     * Draws a debug frame around the object
     * Shows collision boundaries for development
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawFrame(ctx) {
        if(this instanceof Character || 
        this instanceof Chicken || 
        this instanceof ChickenBaby || 
        this instanceof ThrowableObject) {

        ctx.beginPath();
        ctx.lineWidth = '2';
        ctx.strokeStyle = "red";
        
        ctx.rect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        ctx.stroke();
    }
    }
    
    
    /**
     * Loads multiple images and stores them in cache
     * @param {Array<string>} arr - Array of image paths
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

}