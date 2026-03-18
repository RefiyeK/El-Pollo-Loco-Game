class Cloud extends MovableObject {

    y = 20;
    width = 500;
    height = 250;


    /**
     * Creates a moving cloud at a random X position
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 7000;
        this.speed = 0.2;
    }


    /**
     * Updates cloud position for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    update(deltaTime) {
        const factor = deltaTime / (1000 / 60);
        this.x -= this.speed * factor;
    }
}