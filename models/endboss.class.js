class Endboss extends MovableObject {

    height = 400;
    width = 300;
    y = 70;
    health = 100;
    dead = false;
    hurt = false;
    lastHit = 0;
    lastAnimationUpdate = 0;
    movementTimer = 0;

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
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
        'img/4_enemie_boss_chicken/5_dead/G27.png'
    ];


    /**
     * Creates the endboss — loads images, sets start position
     */
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
        this.offset = { top: 100, bottom: 50, left: 0, right: 0 };
        this.dangerMusicPlaying = false;
        this.dangerMusicStartTime = 0;
        this.applyGravity();
    }


    /**
     * Updates endboss for one frame
     * Called by World game loop each frame
     * @param {number} deltaTime - Milliseconds since last frame
     */
    update(deltaTime) {
        this.checkIfHurt();
        this.updateMovement(deltaTime);
        this.updateDangerMusic();
        this.selectAnimation();
    }


    /**
    * Manages danger music independently from animation state
    * Triggers when character is in range, stops when out of range or dead
    */
    updateDangerMusic() {
        if (this.dead) {
            if (this.dangerMusicPlaying) {
                AudioHub.stopDangerMusic();
                this.dangerMusicPlaying = false;
            }
            return;
        }
        const inRange = this.checkIfCharacterInRange();
        if (inRange && !this.dangerMusicPlaying) {
            AudioHub.playDangerMusic();
            this.dangerMusicPlaying = true;
            this.dangerMusicStartTime = Date.now();
        } else if (!inRange && this.dangerMusicPlaying) {
            AudioHub.stopDangerMusic();
            this.dangerMusicPlaying = false;
        }
    }

    /**
    * Throttles movement to ~30fps for consistent boss speed
    * Follows character — moves left or right based on character position
    * @param {number} deltaTime - Milliseconds since last frame
    */
    updateMovement(deltaTime) {
        this.movementTimer += deltaTime;
        if (this.movementTimer < 1000 / 30) return;
        this.movementTimer = 0;

        if (this.dead || !this.checkIfCharacterInRange()) return;
        this.followCharacter();
        if (this.shouldJump()) this.jump();
    }


    /**
    * Moves endboss toward the character and flips sprite accordingly
    * Only turns around when character has fully passed the boss
    */
    followCharacter() {
        const char = this.world.character;
        const characterFullyPastRight = char.x > this.x + this.width;
        const characterFullyPastLeft  = char.x + char.width < this.x;

        if (characterFullyPastRight) {
            this.moveRight();
            this.otherDirection = true;
        } else if (characterFullyPastLeft) {
            this.moveLeft();
            this.otherDirection = false;
        } else {
            this.moveLeft();
            this.otherDirection = false;
        }
    }


    /**
     * Returns animation speed in ms based on boss state
     * @returns {number} Milliseconds between animation frames
     */
    getAnimationSpeed() {
        if (this.dead)  return 150;
        if (this.hurt)  return 100;
        if (this.checkIfCharacterVeryClose()) return 120;
        return 150;
    }


    /**
     * Selects and plays the correct animation for current state
     */
    selectAnimation() {
        const now = Date.now();
        if (now - this.lastAnimationUpdate < this.getAnimationSpeed()) return;
        this.lastAnimationUpdate = now;

        if (this.dead)                             this.playDeadAnimation();
        else if (this.hurt)                        this.playAnimation(this.IMAGES_HURT);
        else if (this.checkIfCharacterVeryClose()) this.playAnimation(this.IMAGES_ATTACK);
        else if (this.checkIfCharacterInRange())   this.handleDangerZone();
        else                                       this.handleNormalState();
    }


    /**
     * Plays death animation and stops at last frame
     */
    playDeadAnimation() {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.currentImage >= this.IMAGES_DEAD.length) {
            this.currentImage = this.IMAGES_DEAD.length - 1;
        }
    }


    /**
     * Handles danger zone — starts music and plays alert animation
     */
    handleDangerZone() {
        const timeSinceDanger = Date.now() - this.dangerMusicStartTime;
        this.playAnimation(timeSinceDanger < 3000 ? this.IMAGES_ALERT : this.IMAGES_WALKING);
    }


    /**
     * Handles normal state — stops music and plays walking animation
     */
    handleNormalState() {
        this.playAnimation(this.IMAGES_WALKING);
    }


    /**
     * Applies damage to boss — sets hurt/dead flags
     * energy=0 ensures MovableObject.isDead() works correctly externally
     * @param {number} damage - Amount of damage to apply
     */
    takeDamage(damage) {
        this.health = Math.max(0, this.health - damage);
        this.hurt = true;
        this.lastHit = Date.now();
        if (this.health === 0) {
            this.dead = true;
            this.energy = 0;
        }
    }


    /**
     * Resets hurt flag after 100ms
     */
    checkIfHurt() {
        if (Date.now() - this.lastHit > 100) this.hurt = false;
    }


    /**
     * Checks if character is within activation range
     * @returns {boolean} True if distance < 600px
     */
    checkIfCharacterInRange() {
        return Math.abs(this.x - this.world.character.x) < 600;
    }


    /**
     * Checks if character is very close (attack range)
     * @returns {boolean} True if distance < 250px
     */
    checkIfCharacterVeryClose() {
        return Math.abs(this.x - this.world.character.x) < 250;
    }


    /**
     * Makes the endboss jump if conditions are met
     */
    jump() {
        if (this.isAboveGround() || !this.canJump) return;
        this.speedY = 35;
        this.lastJump = Date.now();
        this.canJump = false;
        setTimeout(() => { this.canJump = true; }, this.jumpCooldown);
    }


    /**
     * Checks if endboss should jump based on distance and cooldown
     * @returns {boolean} True if jump conditions are met
     */
    shouldJump() {
        const distance = Math.abs(this.x - this.world.character.x);
        const timeSinceLastJump = Date.now() - this.lastJump;
        return distance < 500 && timeSinceLastJump > this.jumpCooldown && this.canJump;
    }


    /**
     * Checks if endboss is above its ground level (y=70)
     * @returns {boolean} True if above ground
     */
    isAboveGround() {
        return this.y < 70;
    }
}