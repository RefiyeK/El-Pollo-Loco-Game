class ThrowableObject extends MovableObject {

    isSplashed = false;
    hasHitGround = false;
    canBeRemoved = false;
    throwDirection = 1;
    animationTimer = 0;
    ANIMATION_INTERVAL = 100;
    MOVE_SPEED = 22;
    MOVE_INTERVAL = 25;

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
     * Creates a throwable bottle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} direction - Throw direction (1=right, -1=left)
     */
    constructor(x, y, direction = 1) {
        super().loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 40;
        this.throwDirection = direction;
        this.offset = { top: 15, bottom: 10, left: 5, right: 5 };
        this.speedY = 22;
        this.applyGravity();
    }


    /**
     * Updates bottle position and animation for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    update(deltaTime) {
        if (this.canBeRemoved) return;
        this.updateMovement(deltaTime);
        this.updateAnimation(deltaTime);
        this.checkGroundCollision();
    }


    /**
     * Moves bottle horizontally based on elapsed time
     * Preserves original speed of 22px per 25ms
     * @param {number} deltaTime - Milliseconds since last frame
     */
    updateMovement(deltaTime) {
        if (this.isSplashed) return;
        const factor = deltaTime / this.MOVE_INTERVAL;
        this.x += this.MOVE_SPEED * this.throwDirection * factor;
    }


    /**
     * Advances rotation or splash animation based on elapsed time
     * @param {number} deltaTime - Milliseconds since last frame
     */
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer < this.ANIMATION_INTERVAL) return;
        this.animationTimer = 0;

        if (this.isSplashed) {
            this.playSplashAnimation();
        } else {
            this.playAnimation(this.IMAGES_ROTATION);
        }
    }

    checkGroundCollision() {
    if (this.hasHitGround || this.isSplashed) return;
    if (this.y >= 380) {
        this.y = 380;
        this.hasHitGround = true;
        this.splash();
    }
}


    /**
     * Shatters the bottle — plays sound and schedules removal
     */
    splash() {
        this.isSplashed = true;
        this.speedY = 0;
        AudioHub.playSound(AudioHub.bottle_break_sound, 0.3);
        setTimeout(() => { this.canBeRemoved = true; }, 600);
    }


    /**
     * Plays splash animation once — stops on last frame
     */
    playSplashAnimation() {
        const i = this.currentImage % this.IMAGES_SPLASH.length;
        if (i < this.IMAGES_SPLASH.length - 1) {
            this.img = this.imageCache[this.IMAGES_SPLASH[i]];
            this.currentImage++;
        }
    }
}