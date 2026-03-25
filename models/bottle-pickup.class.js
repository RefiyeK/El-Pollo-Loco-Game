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
     * Creates a collectable bottle on the ground
     * Randomly selects one of the bottle images
     * @param {number} x - X-position of the bottle
     */
    constructor(x) {
        super(); 
        let randomIndex = Math.floor(Math.random() * this.IMAGES.length);         
        this.loadImage(this.IMAGES[randomIndex]);
        this.x = x;
        this.offset = { top: 5, bottom: 5, left: 10, right: 10 };
    }
}