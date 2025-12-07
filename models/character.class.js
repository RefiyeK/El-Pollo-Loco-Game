class Character extends MovableObject{
    
    
    height = 300;
    width = 150;
    y = 40;
    speed = 10;
    coins = 0;
    bottles = 0;
    maxCoins = 50; //toplanacak maximum altin sayisi
    maxBottles = 10; //toplanacak maximum sise sayisi

    lastAction = new Date().getTime(); //Enson ne zaman hareket etti
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

    animate() {
        
        setInterval(() => {
            if(!isGameActive()) return;
           let isWalking = false; //Varsayilan: yürümüyor

            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
               this.moveRight();
               this.otherDirection = false;//sola tiklarsam resmi döndür
               isWalking = true; //yürüyor
               this.lastAction = new Date().getTime(); //Hareket etti
            }    

            if(this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft(); //sola gitme tusuna basar basmaz ve x kordinatlarinin icinde oldugu sürece sola hareket etmeli.
                this.otherDirection = true; //saga tiklarsam resmi döndürme
                isWalking = true; //yürüyor
                this.lastAction = new Date().getTime(); //Hareket etti
            }
            
            //SES KONTROL
            if(isWalking) {
                this.playWalkingSound(); //Yürüyorsa cal
            } else {
                this.stopWalkingSound(); //Duruyor mu? Durdur
            }

            if(this.world.keyboard.UP && !this.isAboveGround() || this.world.keyboard.SPACE && !this.isAboveGround()){ //Yukari tusuna bastigimizda ve havada degilse
                this.jump(); //movable icinde belirledigimiz ne kadar yukari ziplasin`i burada cagirmis olduk.
                this.lastAction = new Date().getTime();
            }
        }, 1000 / 60); //60 mal pro Sekunde
        
        
        setInterval( () => { 
            if(!isGameActive()) return;

            if (this.isDead()) { //eger ölürsek
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) { //eger yaralandiysak
                this.playAnimation(this.IMAGES_HURT);
            }else if (this.isAboveGround()){ //eger ziplarsak alttaki görseli göster
               this.playAnimation(this.IMAGES_JUMPING);
            } else if(this.isIdle()) { //Hareketsiz mi?
                this.playAnimation(this.IMAGES_IDLE); //Uyku animasyonu
            }else {
                if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {//sadece saga ya da sola gitme tusuna basarsam gitsin.
                this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
        
    }
    
    jump() {
        this.speedY = 25; //ne kadar yüksege ziplayacagi belirli

        //Ziplama sesi ayari
        AudioHub.jump_sound.currentTime = 0; //Basa sar
        AudioHub.jump_sound.volume = 0.2; //ses seviyesi 20%
        AudioHub.jump_sound.play().catch(() => {
            console.warn("Sprung-Sound konnte nicht abgespielt werden", e);
        });
    }

    collectCoin() { //Altin mantigi maksimum sinira ulasmadiysa toplar
        if(this.coins < this.maxCoins) { //Maksimum sinira ulasmadiysa
            this.coins += 1; //Altin sayisini 1 arttir
        } 
    }

    collectBottle() { //Sise toplama mantigi
    if(this.bottles < this.maxBottles) { //Sise sayisi maximum(10)  sise sayisina ulasmadiysa
        this.bottles += 1; //Sise sayisini bir attir
        }
    }

    //KARAKTER YÜRÜME SESI
    playWalkingSound() {
        //Eger ses calmiyorsa, baslat
        if(AudioHub.walking_sound.paused) {
            AudioHub.walking_sound.currentTime = 0; //Basa sar
            AudioHub.walking_sound.volume = 0.4; //ses seviyesi 50%
            AudioHub.walking_sound.loop = true; //Sürekli tekrarla
            AudioHub.walking_sound.play().catch(e => {
                console.warn("Yürüme sesi calinamadi:", e);
            });
        }
    }

    stopWalkingSound() {
        //Yürüme sesini durdur
        if(!AudioHub.walking_sound.paused) {
            AudioHub.walking_sound.pause();
            AudioHub.walking_sound.currentTime = 0; //Basa sar
        }
    }

    isIdle() { //Suanki zaman en son hareket zamani > 2 saniye mi?
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > this.idleTime; //2 saniye

    }
}