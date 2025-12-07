class Character extends MovableObject{
    
    
    height = 300;
    width = 150;
    y = 40;
    speed = 10;
    coins = 0;
    bottles = 0;
    maxCoins = 50;
    maxBottles = 10;

    lastAction = new Date().getTime();
    idleTime = 2000; //2 saniye
    offset = {
        top: 120,
        bottom: 10,
        left: 30,
        right: 30,
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

    IMAGES_IDLE = [
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
     * Erstellt den spielbaren Charakter
     * Lädt alle Animations-Bilder und startet Schwerkraft
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.applyGravity();
        this.animate();
    }


    /**
     * Verarbeitet Bewegungs-Eingaben
     * Bewegt Charakter basierend auf Tastendruck
     * @returns {boolean} True wenn Charakter sich bewegt
     */
    handleMovement() {
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

        return isWalking;
    }


    /**
     * Verarbeitet Sprung-Eingaben
     * Lässt Charakter springen wenn auf Boden
     */
    handleJump() {
        if(this.world.keyboard.UP && !this.isAboveGround() || 
           this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.lastAction = new Date().getTime();
        }
    }


    /**
     * Verwaltet den Lauf-Sound
     * Startet/Stoppt Sound basierend auf Bewegung
     * @param {boolean} isWalking - Ob Charakter läuft
     */
    manageWalkingSound(isWalking) {
        if(isWalking) {
            this.playWalkingSound();
        } else {
            this.stopWalkingSound();
        }
    }


    /**
     * Startet das Bewegungs-Intervall
     * Verarbeitet Tasteneingaben 60x pro Sekunde
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
     * Wählt die passende Animation basierend auf Charakter-Zustand
     */
    selectAnimation() {
        if(this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if(this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if(this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if(this.isIdle()) {
            this.playAnimation(this.IMAGES_IDLE);
        } else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }


    /**
     * Startet das Animations-Intervall
     * Aktualisiert Animation alle 50ms
     */
    startAnimationLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            this.selectAnimation();
        }, 50);
    }


    /**
     * Startet alle Charakter-Animationen und Bewegungen
     * Initialisiert Bewegungs- und Animations-Loops
     */
    animate() {
        this.startMovementLoop();
        this.startAnimationLoop();
    }
    

    /**
     * Lässt den Charakter springen
     * Setzt vertikale Geschwindigkeit und spielt Sound
     */
    jump() {
        this.speedY = 25;

        AudioHub.jump_sound.currentTime = 0;
        AudioHub.jump_sound.volume = 0.2;
        AudioHub.jump_sound.play().catch((e) => {
            console.warn("Sprung-Sound konnte nicht abgespielt werden:", e);
        });
    }


    /**
     * Sammelt eine Münze ein
     * Erhöht Münz-Zähler bis zum Maximum
     */
    collectCoin() {
        if(this.coins < this.maxCoins) {
            this.coins += 1; 
        } 
    }


    /**
     * Sammelt eine Flasche ein
     * Erhöht Flaschen-Zähler bis zum Maximum
     */
    collectBottle() {
    if(this.bottles < this.maxBottles) {
        this.bottles += 1;
        }
    }


    /**
     * Spielt den Lauf-Sound ab
     * Startet Sound-Loop wenn noch nicht aktiv
     */
    playWalkingSound() {
        if(AudioHub.walking_sound.paused) {
            AudioHub.walking_sound.currentTime = 0;
            AudioHub.walking_sound.volume = 0.4;
            AudioHub.walking_sound.loop = true;
            AudioHub.walking_sound.play().catch(e => {
                console.warn("Lauf-Sound konnte nicht abgespielt werden:", e);
            });
        }
    }


    /**
     * Stoppt den Lauf-Sound
     * Pausiert Sound und setzt zurück
     */
    stopWalkingSound() {
        if(!AudioHub.walking_sound.paused) {
            AudioHub.walking_sound.pause();
            AudioHub.walking_sound.currentTime = 0;
        }
    }


    /**
     * Prüft ob Charakter inaktiv ist
     * @returns {boolean} True wenn länger als 2 Sekunden keine Aktion
     */
    isIdle() {
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > this.idleTime;

    }
}