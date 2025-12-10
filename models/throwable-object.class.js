class ThrowableObject extends MovableObject {

    isSplashed = false;
    hasHitGround = false;
    intervalIds = [];
    canBeRemoved = false;
    throwDirection = 1;

    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];


    /**
     * Creates a throwable object (bottle)
     * @param {number} x - X-position of the bottle
     * @param {number} y - Y-position of the bottle
     * @param {number} direction - Throw direction (1=right, -1=left)
     */
    constructor(x, y, direction=1){
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 40;
        this.throwDirection = direction;
        this.trow();
        this.offset = {
            top: 15,
            bottom: 10,
            left: 5,
            right: 5,
        }
    }


    /**
     * Starts the bottle movement
     * Bottle flies horizontally in throw direction
     */
    startMovement() {
        let moveInterval = setInterval(() => {
            if(!this.isSplashed) {
                this.x += 22 * this.throwDirection;
            }
        }, 25);
        this.intervalIds.push(moveInterval);
    }


    /**
     * Starts the rotation animation
     * Switches between rotation and splash images
     */
    startAnimation() {
        let animationInterval = setInterval(() => {
            if(this.isSplashed) {
                this.playSplashAnimation();
            } else {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
        this.intervalIds.push(animationInterval);
    }


    /**
     * Checks if bottle touches the ground
     * Triggers splash animation on ground contact
     */
    checkGroundCollision() {
        let groundCheckInterval = setInterval(() => {
            let bottleBottom = this.y + this.height;

            if(bottleBottom >= 430 && !this.hasHitGround && !this.isSplashed) {
                this.hasHitGround = true;
                this.splash();
            }
        }, 1000 / 60);
        this.intervalIds.push(groundCheckInterval);
    }


    /**
     * Throws the bottle
     * Starts movement, animation and collision check
     */
    trow() {
        this.speedY = 22;
        this.applyGravity();
        this.startMovement();
        this.startAnimation();
        this.checkGroundCollision();
    }


    /**
     * Makes the bottle shatter
     * Plays glass break sound and marks bottle for removal
     */
    splash() {
        this.isSplashed = true;
        this.speedY = 0;
        
        AudioHub.playSound(AudioHub.bottle_break_sound, 0.3);

        setTimeout(() => {
            this.intervalIds.forEach(id => clearInterval(id));
            this.canBeRemoved = true;
        }, 600);
    }


    /**
     * Plays the splash animation once and stops on the last frame
     */
    playSplashAnimation() {
        let i = this.currentImage % this.IMAGES_SPLASH.length;
        if (i < this.IMAGES_SPLASH.length - 1) { // Son kareye kadar ilerle
            let path = this.IMAGES_SPLASH[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }
}