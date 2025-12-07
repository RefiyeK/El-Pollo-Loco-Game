class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 320;
    height = 120;
    width = 100;

    
     /**
     * Lädt ein einzelnes Bild
     * @param {string} path - Pfad zum Bild
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    

    /**
     * Zeichnet das Objekt auf dem Canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas-Kontext
     */
    draw(ctx) {
        if(this.img && this.img.complete && this.loadImage.naturalHeight !== 0) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }


    /**
     * Ermittelt die Rahmenfarbe basierend auf Objekttyp
     * @returns {string} Farbe für den Debug-Rahmen
     */
    getFrameColor() {
        if(this instanceof Character) return 'blue';
        if(this instanceof Chicken || this instanceof ChickenBaby) return 'red';
        if(this instanceof ThrowableObject) return 'green';
        if(this instanceof Endboss) return 'orange';
        return 'white';
    }


    /**
     * Berechnet die Rahmen-Koordinaten mit Offset
     * @returns {Object} Rahmen-Koordinaten {x, y, width, height}
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
     * Zeichnet einen Debug-Rahmen um das Objekt
     * Zeigt Kollisions-Grenzen für Entwicklung
     * @param {CanvasRenderingContext2D} ctx - Canvas-Kontext
     */
    drawFrame(ctx) {
        const DEBUG_MODE = false;
        if(!DEBUG_MODE) return;

        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = this.getFrameColor();
        
        let frame = this.getFrameCoordinates();
        ctx.rect(frame.x, frame.y, frame.width, frame.height);
        ctx.stroke();
    }
    
    
    /**
     * Lädt mehrere Bilder und speichert sie im Cache
     * @param {Array<string>} arr - Array von Bild-Pfaden
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

}