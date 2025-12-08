class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    

    /**
     * Creates a moving cloud
     * Cloud starts at random X-position
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 7000;
        this.speed = 0.2;
        this.animate();
    }


    /**
     * Starts the cloud movement
     * Cloud moves continuously to the left
     */
    animate() {
        setInterval(() => {
        if(!isGameActive()) return;
            this.moveLeft();
        }, 1000 / 60);
    }
}