class Chicken extends MovableObject { 

    width = 50;
    height = 80;
    y = 360;
    x = 520;
    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];


    /**
     * Creates a normal chicken
     * Starts at random position with random speed
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_DEAD);

        this.x = 500 + Math.random() * 8000;
        this.speed = 0.15 + Math.random() * 0.5;
        
        this.offset = {
            top: 5,
            bottom: 5,
            left: 5,
            right : 5,
        };
        this.animate();
    }
   

    /**
     * Starts the movement interval
     * Chicken walks to the left
     */
    startMovementLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            if(!this.isDead) {
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
            if(this.isDead) {
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
}