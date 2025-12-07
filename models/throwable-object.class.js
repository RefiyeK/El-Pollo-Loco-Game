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
     * Erstellt ein werfbares Objekt (Flasche)
     * @param {number} x - X-Position der Flasche
     * @param {number} y - Y-Position der Flasche
     * @param {number} direction - Wurfrichtung (1=rechts, -1=links)
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
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
        }
    }


    /**
     * Startet die Bewegung der Flasche
     * Flasche fliegt horizontal in Wurfrichtung
     */
    startMovement() {
        let moveInterval = setInterval(() => {
            if(!this.isSplashed) {
                this.x += 10 * this.throwDirection;
            }
        }, 25);
        this.intervalIds.push(moveInterval);
    }


    /**
     * Startet die Rotations-Animation
     * Wechselt zwischen Rotations- und Splash-Bildern
     */
    startAnimation() {
        let animationInterval = setInterval(() => {
            if(this.isSplashed) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
        this.intervalIds.push(animationInterval);
    }


    /**
     * Prüft ob Flasche den Boden berührt
     * Löst Splash-Animation aus bei Bodenkontakt
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
     * Wirft die Flasche
     * Startet Bewegung, Animation und Kollisionsprüfung
 */
    trow() {
        this.speedY = 30;
        this.applyGravity();
        this.startMovement();
        this.startAnimation();
        this.checkGroundCollision();
    }


    /**
     * Lässt die Flasche zersplittern
     * Spielt Glas-Bruch-Sound und markiert Flasche zum Entfernen
     */
    splash() {
        this.isSplashed = true;
        this.speedY = 0;

        AudioHub.bottle_break_sound.currentTime = 0;
        AudioHub.bottle_break_sound.volume = 0.3;
        AudioHub.bottle_break_sound.play().catch(e => {
            console.warn("Flaschen-Bruch-Sound konnte nicht abgespielt werden:", e);
        });

        setTimeout(() => {
            this.intervalIds.forEach(id => clearInterval(id));
            this.canBeRemoved = true;
        }, 600);
    }
}
