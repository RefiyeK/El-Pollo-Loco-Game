class Endboss extends MovableObject {

    height = 400;
    width = 300;
    y = 70;
    health = 100;
    isDead = false;
    isHurt = false;
    lastHit = 0;
    
    // Animation timing
    lastAnimationUpdate = 0;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'    
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];


    /**
     * Creates an endboss
     * Loads all animation images and sets starting position
     */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
        'img/4_enemie_boss_chicken/5_dead/G27.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 8400;
        this.speed = 10;
        this.canJump = true;
        this.jumpCooldown = 1000;
        this.lastJump = 0;

        this.offset = {
            top: 100,
            bottom : 50,
            left : 0,
            right : 0,
        }

        this.dangerMusicPlaying = false;
        this.dangerMusicStartTime = 0;
        this.applyGravity();
    }


    /**
     * Gets the appropriate animation speed based on boss state
     * Different animations have different speeds for natural look
     * @returns {number} Milliseconds between animation frames
     */
    getAnimationSpeed() {
        if(this.isDead) {
            return 150;
        } else if(this.isHurt) {
            return 100;
        } else if(this.checkIfCharacterVeryClose()) {
            return 120;
        } else if(this.checkIfCharacterInRange()) {
            let timeSinceDanger = new Date().getTime() - this.dangerMusicStartTime;
            if(timeSinceDanger < 3000) {
                return 150;
            } else {
                return 150;
            }
        } else {
            return 150;
        }
    }


    /**
    * Selects the appropriate animation based on boss state
    */
    selectAnimation() {
        let currentTime = Date.now();
        let animationSpeed = this.getAnimationSpeed();
        
        if(currentTime - this.lastAnimationUpdate < animationSpeed) {
            return;
        }
        
        this.lastAnimationUpdate = currentTime;
        
        if(this.isDead) {
            this.playDeadAnimation();
        } else if(this.isHurt) {
            this.playAnimation(this.IMAGES_HURT);
        } else if(this.checkIfCharacterVeryClose()) {
            this.playAnimation(this.IMAGES_ATTACK);
        } else if(this.checkIfCharacterInRange()) {
            this.handleDangerZone();
        } else {
            this.handleNormalState();
        }
    }


    /**
    * Plays the death animation
    * Stops at the last frame
    */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        
        if(this.currentImage >= this.IMAGES_DEAD.length) {
            this.currentImage = this.IMAGES_DEAD.length - 1;
        }
        
        if(this.dangerMusicPlaying) {
            AudioHub.stopDangerMusic();
            this.dangerMusicPlaying = false;
        }
    }


    /**
    * Handles danger zone (character in range)
    * Starts danger music and alert animation
    */
    handleDangerZone() {
        if(!this.dangerMusicPlaying) {
            AudioHub.playDangerMusic();
            this.dangerMusicPlaying = true;
            this.dangerMusicStartTime = Date.now();
        }
        let timeSinceDanger = Date.now() - this.dangerMusicStartTime;

        if(timeSinceDanger < 3000) {
            this.playAnimation(this.IMAGES_ALERT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }


    /**
    * Handles normal state (character far away)
    * Stops danger music and plays walking animation
    */
    handleNormalState() {
        this.playAnimation(this.IMAGES_WALKING);
        
        if(this.dangerMusicPlaying) {
            AudioHub.stopDangerMusic();
            this.dangerMusicPlaying = false;
        }
    }


    /**
    * Starts the animation interval
    * Checks every 50ms but only updates when needed based on animation speed
    */
    startAnimationLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            this.selectAnimation();
        }, 50);
    }


    /**
    * Starts the movement interval
    * Boss moves to the left
    */
    startMovementLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            if(!this.isDead && this.checkIfCharacterInRange()) {
                this.moveLeft();
                
                if(this.shouldJump()) {
                    this.jump();
                }
            }
        }, 1000 / 30);
    }


    /**
    * Starts the hurt check interval
    * Checks if hurt status should be reset
    */
    startHurtCheckLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            this.checkIfHurt();
        }, 500);
    }


    /**
    * Starts all endboss animations and movements
    * Initializes all game loop intervals
    */
    animate() {
        this.startAnimationLoop();
        this.startMovementLoop();
        this.startHurtCheckLoop();
    }


    /**
    * Boss takes damage
    * @param {number} damage - Amount of damage
    */
    takeDamage(damage) {
        this.health -= damage;
        if(this.health < 0) {
            this.health = 0;
        }

        this.isHurt = true;
        this.lastHit = Date.now();

        if(this.health === 0) {
            this.isDead = true;
        }
    }

    
    /**
    * Checks if hurt animation should be reset
    * Sets isHurt to false after 100ms
    */
    checkIfHurt() {
        if(new Date().getTime() - this.lastHit > 100) {
            this.isHurt = false;
        }
    }


    /**
    * Checks if character is in range
    * @returns {boolean} True if distance < 600 pixels
    */
    checkIfCharacterInRange() {
        let distance = Math.abs(this.x - this.world.character.x);
        if(distance < 600) {
            return true;
        }else {
            return false;
        }
    }


    /**
    * Checks if character is very close
    * @returns {boolean} True if distance < 250 pixels (INCREASED FROM 200!)
    */
    checkIfCharacterVeryClose() {
        let distance = Math.abs(this.x - this.world.character.x);

        if(distance < 250) {
            return true;
        } else {
            return false;
        }
    }


    /**
    * Makes the endboss jump
    */
    jump() {
        if(!this.isAboveGround() && this.canJump) {
            this.speedY = 35;
            this.lastJump = new Date().getTime();
            this.canJump = false;
        
            setTimeout(() => {
                this.canJump = true;
            }, this.jumpCooldown);
        }
    }


    /**
    * Checks if endboss should jump (when character is close)
    */
    shouldJump() {
        let distance = Math.abs(this.x - this.world.character.x);
        let timeSinceLastJump = new Date().getTime() - this.lastJump;
    
        return distance < 500 && timeSinceLastJump > this.jumpCooldown && this.canJump;
    }


    /**
    * Checks if endboss is above ground
    * Endboss ground level is at y = 70
    * @returns {boolean} True if above ground
    */
    isAboveGround() {
        return this.y < 70;
    }
}