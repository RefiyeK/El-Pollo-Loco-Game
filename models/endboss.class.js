class Endboss extends MovableObject {

    height = 400;
    width = 300;
    y = 70;
    health = 100;
    isDead = false;
    isHurt = false;
    lastHit = 0;

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
     * Erstellt einen Endboss
     * Lädt alle Animations-Bilder und setzt Start-Position
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
        this.x = 7400;

        this.offset = {
            top: 100,
            bottom : 50,
            left : 0,
            right : 0,
        }

        this.dangerMusicPlaying = false;
    }


    /**
     * Wählt die passende Animation basierend auf Boss-Zustand
     */
    selectAnimation() {
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
     * Spielt die Tod-Animation ab
     * Stoppt bei letztem Frame
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
     * Behandelt Gefahr-Zone (Charakter in Reichweite)
     * Startet Gefahr-Musik und Alert-Animation
     */
    handleDangerZone() {
        if(!this.dangerMusicPlaying) {
            AudioHub.playDangerMusic();
            this.dangerMusicPlaying = true;
        }
        this.playAnimation(this.IMAGES_ALERT);
    }


    /**
     * Behandelt normalen Zustand (Charakter weit weg)
     * Stoppt Gefahr-Musik und spielt Lauf-Animation
     */
    handleNormalState() {
        this.playAnimation(this.IMAGES_WALKING);
        
        if(this.dangerMusicPlaying) {
            AudioHub.stopDangerMusic();
            this.dangerMusicPlaying = false;
        }
    }


    /**
     * Startet das Animations-Intervall
     * Aktualisiert Animation alle 200ms
     */
    startAnimationLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            this.selectAnimation();
        }, 200);
    }


    /**
     * Startet das Bewegungs-Intervall
     * Boss bewegt sich nach links
     */
    startMovementLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            if(!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }


    /**
     * Startet das Hurt-Check-Intervall
     * Prüft ob Hurt-Status zurückgesetzt werden soll
     */
    startHurtCheckLoop() {
        setInterval(() => {
            if(!isGameActive()) return;
            this.checkIfHurt();
        }, 500);
    }


    /**
     * Startet alle Endboss-Animationen und Bewegungen
     * Initialisiert alle Game-Loop-Intervalle
     */
    animate() {
        this.startAnimationLoop();
        this.startMovementLoop();
        this.startHurtCheckLoop();
    }


    /**
     * Boss nimmt Schaden
     * @param {number} damage - Schadensmenge
     */
    takeDamage(damage) {
        this.health -= damage;
        if(this.health < 0) {
            this.health = 0;
        }

        this.isHurt = true;
        this.lastHit = new Date().getTime();

        AudioHub.endboss_sound.currentTime = 0;
        AudioHub.endboss_sound.volume = 0.1;
        AudioHub.endboss_sound.play();

        if(this.health === 0) {
            this.isDead = true;
        }
    }

    
    /**
     * Prüft ob Hurt-Animation zurückgesetzt werden soll
     * Setzt isHurt nach 100ms auf false
     */
    checkIfHurt() {
        if(new Date().getTime() - this.lastHit > 100) {
            this.isHurt = false;
        }
    }


    /**
     * Prüft ob Charakter in Reichweite ist
     * @returns {boolean} True wenn Abstand < 400 Pixel
     */
    checkIfCharacterInRange() {
        let distance = Math.abs(this.x - this.world.character.x);
        if(distance < 400) {
            return true;
        }else {
            return false;
        }
    }


    /**
     * Prüft ob Charakter sehr nah ist
     * @returns {boolean} True wenn Abstand < 200 Pixel
     */
    checkIfCharacterVeryClose() {
        let distance = Math.abs(this.x - this.world.character.x);

        if(distance < 200) {
            return true;
        } else {
            return false;
        }
    }
}