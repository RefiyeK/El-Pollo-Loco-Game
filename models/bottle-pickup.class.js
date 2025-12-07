class BottlePickup extends MovableObject {

    width = 50;
    height = 40;
    y = 400;
    isCollected = false;

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]


    /**
     * Erstellt eine sammelbare Flasche am Boden
     * Wählt zufällig eines der Flaschen-Bilder
     * @param {number} x - X-Position der Flasche
     */
    constructor(x) {
        super(); 
        let randomIndex = Math.floor(Math.random() * this.IMAGES.length);         
        
        this.loadImage(this.IMAGES[randomIndex]);
        this.x = x;
    }
}