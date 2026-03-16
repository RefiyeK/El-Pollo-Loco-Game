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
        if(this.img && this.img.complete && this.img.naturalHeight !== 0) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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