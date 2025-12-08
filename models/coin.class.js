class Coin extends MovableObject {
    width = 80;
    height = 80;
    initialY;
    maxHeight =350;
    isMovingUp = true;
    verticalSpeed = 5;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];


    /**
     * Creates a collectable coin
     * @param {number} x - X-position of the coin
     * @param {number} y - Y-position of the coin (default: 150)
     */
    constructor(x, y = 150) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.x = x;
        this.y = y;

        //Collision box settings
        this.offset = {
        top: 25,
        bottom: 25,
        left: 25,
        rifht: 25,
        }
        this.animate();
    }


    /**
     * Starts the coin animation
     * Switches between two images for sparkle effect
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}