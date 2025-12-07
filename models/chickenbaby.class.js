class ChickenBaby extends MovableObject {

width = 30;
height = 40;
y= 395;
isDead = false;


IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
];


IMAGES_DEAD = [
    'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
];


    /**
     * Erstellt ein Baby-Huhn
     * Startet an zufälliger Position mit zufälliger Geschwindigkeit
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 700 + Math.random() * 7000;
        this.speed = 0.1 + Math.random() * 0.3;

        this.offset = {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
        };
        this.animate();
    }


    /**
     * Startet das Bewegungs-Intervall
     * Baby-Huhn läuft nach links
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
     * Startet das Animations-Intervall
     * Wechselt zwischen Lauf- und Tod-Animation
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
     * Startet alle Animationen und Bewegungen
     * Initialisiert Bewegungs- und Animations-Loops
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }
}