class ChickenBaby extends MovableObject {

width = 30;
height = 40;
y= 395;


IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
];


IMAGES_DEAD = [
    'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
];


    /**
     * Creates a baby chicken
     * Starts at random position with random speed
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 700 + Math.random() * 7000;
        this.speed = 0.1 + Math.random() * 0.3;
        this.energy = 1;

        this.offset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
        this.animate();
    }


    /**
     * Starts the movement interval
     * Baby chicken walks to the left
     */
    startMovementLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            if(!this.isDead()) {
                this.moveLeft();
                this.otherDirection = false;
            }
        }, 1000 / 60);
    }


    /**
     * Starts the animation interval
     * Switches between walking and death animation
     */
    startAnimationLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            if(this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    
    /**
     * Starts all animations and movements
     * Initializes movement and animation loops
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }


    /**
    * Handles hit on chick
    * Sets energy to 0 (instant death)
    */
    hit() {
        this.energy = 0;
    }


    /**
    * Checks if the chick is dead
    * @returns {boolean} True if dead
    */
    isDead() {
        return this.energy === 0;
    }
}