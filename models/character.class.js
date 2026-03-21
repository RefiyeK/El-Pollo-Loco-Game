class Character extends MovableObject {

    height = 300;
    width = 150;
    y = 40;
    speed = 10;
    coins = 0;
    bottles = 0;
    maxCoins = 50;
    maxBottles = 10;
    lastThrow = 0;
    lastAction = Date.now();
    LONG_IDLE_TIME = 5000;
    lastAnimationUpdate = 0;

    offset = { top: 120, bottom: 10, left: 40, right: 50 };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_STAND_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    world;


    /**
     * Creates the playable character
     * Loads all animation images and enables gravity
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_STAND_IDLE);
        this.applyGravity();
    }


    /**
     * Updates character for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    update(deltaTime) {
        const isWalking = this.handleMovement();
        this.manageWalkingSound(isWalking);
        this.handleJump();
        this.selectAnimation();
    }


    /**
     * Processes movement inputs
     * @returns {boolean} True if character is moving
     */
    handleMovement() {
        if (this.isDead()) return false;

        let isWalking = false;

        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            isWalking = true;
            this.lastAction = Date.now();
        }

        if (this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            isWalking = true;
            this.lastAction = Date.now();
        }

        if (this.world.keyboard.D) {
            this.lastAction = Date.now();
        }

        return isWalking;
    }


    /**
     * Processes jump input
     * Makes character jump if on ground
     */
    handleJump() {
        if (this.isDead()) return;

        const jumpPressed = this.world.keyboard.UP || this.world.keyboard.SPACE;
        if (jumpPressed && !this.isAboveGround()) {
            this.jump();
            this.lastAction = Date.now();
        }
    }


    /**
     * Manages walking sound based on movement state
     * @param {boolean} isWalking - Whether character is moving
     */
    manageWalkingSound(isWalking) {
        if (isWalking) {
            this.playWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }


    /**
     * Returns animation frame interval based on current state
     * @returns {number} Milliseconds between animation frames
     */
    getAnimationSpeed() {
        if (this.isDead())    return 100;
        if (this.isHurt())    return 150;
        if (this.isAboveGround()) return 80;
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) return 120;
        return 200;
    }


    /**
     * Selects and plays the correct animation for current state
     */
    selectAnimation() {
        const now = Date.now();
        if (now - this.lastAnimationUpdate < this.getAnimationSpeed()) return;
        this.lastAnimationUpdate = now;

        if (this.isDead())              this.playAnimation(this.IMAGES_DEAD);
        else if (this.isHurt())         this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround())  this.playAnimation(this.IMAGES_JUMPING);
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
                                        this.playAnimation(this.IMAGES_WALKING);
        else if (this.isLongIdle())     this.playAnimation(this.IMAGES_LONG_IDLE);
        else                            this.playAnimation(this.IMAGES_STAND_IDLE);
    }


    /**
     * Makes the character jump and resets jump animation to first frame
    */
    jump() {
        this.speedY = 25;
        this.currentImage = 0;
        AudioHub.playSound(AudioHub.jump_sound, 0.2);
    }


    /**
     * Collects a coin — increases counter up to maximum
     */
    collectCoin() {
        if (this.coins < this.maxCoins) this.coins += 1;
    }


    /**
     * Collects a bottle — increases counter up to maximum
     */
    collectBottle() {
        if (this.bottles < this.maxBottles) this.bottles += 1;
    }


    /**
     * Starts walking sound loop if not already playing
     */
    playWalkingSound() {
        if (AudioHub.isMuted) return;
        if (!AudioHub.walking_sound.paused) return;

        AudioHub.walking_sound.currentTime = 0;
        AudioHub.walking_sound.volume = 0.4;
        AudioHub.walking_sound.loop = true;

        const playPromise = AudioHub.walking_sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    }


    /**
     * Stops walking sound and resets position
     */
    stopWalkingSound() {
        if (AudioHub.walking_sound.paused) return;
        AudioHub.walking_sound.pause();
        AudioHub.walking_sound.currentTime = 0;
    }


    /**
     * Checks if character has been idle for long period
     * @returns {boolean} True if idle > LONG_IDLE_TIME
     */
    isLongIdle() {
        return Date.now() - this.lastAction > this.LONG_IDLE_TIME;
    }


    /**
     * Returns collision offset based on character state
     * @returns {Object} Offset values for collision detection
     */
    getCollisionOffset() {
        if (this.isAboveGround()) {
            return { top: 120, bottom: 40, left: 30, right: 30 };
        }
        return { top: 120, bottom: 5, left: 20, right: 20 };
    }
}