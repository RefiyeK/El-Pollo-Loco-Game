class Character extends MovableObject{
    
    
    height = 300;
    width = 150;
    y = 40;
    speed = 10;
    coins = 0;
    bottles = 0;
    maxCoins = 50;
    maxBottles = 10;
    lastThrow = 0;
    lastAction = new Date().getTime();
    SHORT_IDLE_TIME = 2000;
    LONG_IDLE_TIME = 10000;
    offset = {
        top: 120,
        bottom: 10,
        left: 40,
        right: 50,
    }

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
     * Loads all animation images and starts gravity
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
        this.animate();
    }


    /**
     * Processes movement inputs
     * Moves character based on key press
     * @returns {boolean} True if character is moving
     */
    handleMovement() {

        if(this.isDead()) {
            return false;
        }

        let isWalking = false;

        if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            isWalking = true;
            this.lastAction = new Date().getTime();
        }

        if(this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            isWalking = true;
            this.lastAction = new Date().getTime();
        }

        if(this.world.keyboard.D) {
            this.lastAction = new Date().getTime();
        }

        return isWalking;
    }


    /**
     * Processes jump inputs
     * Makes character jump if on ground
     */
    handleJump() {

        if(this.isDead()) {
            return false;
        }
        if(this.world.keyboard.UP && !this.isAboveGround() || 
           this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.lastAction = new Date().getTime();
        }
    }


    /**
     * Manages the walking sound
     * Starts/Stops sound based on movement
     * @param {boolean} isWalking - Whether character is walking
     */
    manageWalkingSound(isWalking) {
        if(isWalking) {
            this.playWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }


    /**
     * Starts the movement interval
     * Processes key inputs 60 times per second
     */
    startMovementLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            
            let isWalking = this.handleMovement();
            this.manageWalkingSound(isWalking);
            this.handleJump();
        }, 1000 / 60);
    }


    /**
     * Selects the appropriate animation based on character state
     */
    selectAnimation() {
        if(this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if(this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if(this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if(this.isLongIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
        } else if(this.isStandIdle()) {
            this.playAnimation(this.IMAGES_STAND_IDLE);
        } else {
             this.playAnimation(this.IMAGES_STAND_IDLE);
    }
}


    /**
     * Starts the animation interval
     * Updates animation every 50ms
     */
    startAnimationLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            this.selectAnimation();
        }, 50);
    }


    /**
     * Starts all character animations and movements
     * Initializes movement and animation loops
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }
    

    /**
     * Makes the character jump
     * Sets vertical speed and plays sound
     */
    jump() {
         this.speedY = 25;
        AudioHub.playSound(AudioHub.jump_sound, 0.2);
    }


    /**
     * Collects a coin
     * Increases coin counter up to maximum
     */
    collectCoin() {
        if(this.coins < this.maxCoins) {
            this.coins += 1; 
        } 
    }


    /**
     * Collects a bottle
     * Increases bottle counter up to maximum
     */
    collectBottle() {
    if(this.bottles < this.maxBottles) {
        this.bottles += 1;
        }
    }


    /**
     * Plays the walking sound
     * Starts sound loop if not already active
     */
    playWalkingSound() {
        if(AudioHub.isMuted) return;
    
        if(AudioHub.walking_sound.paused) {
            AudioHub.walking_sound.currentTime = 0;
            AudioHub.walking_sound.volume = 0.4;
            AudioHub.walking_sound.loop = true;
            AudioHub.walking_sound.play().catch(e => {
            console.warn("Walking sound could not be played:", e);
        });
    }
}


    /**
     * Stops the walking sound
     * Pauses sound and resets
     */
    stopWalkingSound() {
        if(!AudioHub.walking_sound.paused) {
            AudioHub.walking_sound.pause();
            AudioHub.walking_sound.currentTime = 0;
        }
    }


    /**
    * Checks if enough time has passed for the character to play the idle animation.
    * @returns {boolean} True if no action for more than SHORT_IDLE_TIME
    */
    isStandIdle() {
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > this.SHORT_IDLE_TIME;
    }


    /**
    * Checks if enough time has passed for the character to play the sleeping (Long Idle) animation.
    * @returns {boolean} True if no action for more than LONG_IDLE_TIME
    */
    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > this.LONG_IDLE_TIME;
    }


    /**
     * Checks if character is idle
     * @returns {boolean} True if no action for more than 2 seconds
     */
    isIdle() {
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > this.idleTime;
    }


    /**
    * Returns the appropriate collision offset based on character state
    * @returns {Object} Offset values for collision detection
    */
    getCollisionOffset() {
        if(this.isAboveGround()) {
            return {
                top: 120,
                bottom: 40,
                left: 30,
                right: 30,
            };
        }
    
        return {
            top: 120,
            bottom: 5,
            left: 20,
            right: 20,
        };
    }
}