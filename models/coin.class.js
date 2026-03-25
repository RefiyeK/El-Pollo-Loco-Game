class Coin extends MovableObject {

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    animationTimer = 0;
    ANIMATION_INTERVAL = 200;


    /**
     * Creates a collectable coin
     * @param {number} x - X position
     * @param {number} y - Y position (default: 150)
     */
    constructor(x, y = 150) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.offset = { top: 30, bottom: 30, left: 30, right: 30 };
    }


    /**
     * Updates coin animation for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    update(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer < this.ANIMATION_INTERVAL) return;
        this.animationTimer = 0;
        this.playAnimation(this.IMAGES);
    }
}