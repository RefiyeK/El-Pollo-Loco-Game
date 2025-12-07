class BackgroundObject extends MovableObject{

        width = 720;
        height = 480;
    
    
    /**
     * Erstellt ein Hintergrund-Objekt
     * Positioniert Hintergrund-Bild am unteren Rand
     * @param {string} imagePath - Pfad zum Hintergrund-Bild
     * @param {number} x - X-Position des Hintergrunds
     */
    constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
        
    }
}