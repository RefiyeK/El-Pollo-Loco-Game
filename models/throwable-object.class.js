class ThrowableObject extends MovableObject {

    isSplashed = false; //Sise kirildi mi?
    hasHitGround = false; //sise yere carpti mi?
    intervalIds = []; //tüm intervalleri sakla
    canBeRemoved = false; //sise silinebilir mi
    throwDirection = 1; //Atis yönü (1=saga, -1=sola) 

        //GÖRSELLER DÖNERKEN
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

        //KIRILDIKTAN SONRA GÖRSELLER
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    constructor(x, y, direction=1){
        super().loadImage(this.IMAGES_ROTATION[0]);//Ilk sise görseli
        this.loadImages(this.IMAGES_ROTATION); //Dönerken sise görselleri
        this.loadImages(this.IMAGES_SPLASH); //splash görseller

        this.x = x;
        this.y = y;
        this.height = 60; //sisenin yüksekligi
        this.width = 40; //sisenin genisligi
        this.throwDirection = direction; //Yönü kaydet
        this.trow();
        this.offset = { //Siselerin carpisma kutusunu
            top: 10, //Üstten 5px iceri
            bottom: 10,//Alttan " " " "
            left: 10, //soldan " " " "
            right: 10, //sagdan " " " "
        }
    }


    trow() {
        this.speedY = 30; //yukari firlat
        this.applyGravity(); //yercekimi uygula

        // Hareket interval`i - Yöne göre hareket et 
        let moveInterval = setInterval(() => {
            if(!this.isSplashed) { // Kırıldıysa durmalı
                this.x += 10 * this.throwDirection;
            }
        }, 25);
        this.intervalIds.push(moveInterval); // Interval'i kaydet

        // Animasyon interval'i - SAKLA
        let animationInterval = setInterval(() => {
            if(this.isSplashed) {
                this.playAnimation(this.IMAGES_SPLASH);
            } else {
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
        this.intervalIds.push(animationInterval); // Interval'i kaydet



        // SISENIN YERE CARPMA ÖZELLIGI
        let groundCheckInterval = setInterval(() => {
            let bottleBottom = this.y + this.height; //Sisenin alt kenari zemine cok yaklasti mi

            if(bottleBottom >= 430 && !this.hasHitGround && !this.isSplashed) {
                this.hasHitGround = true;
                this.splash();
            }
        }, 1000 / 60);
        this.intervalIds.push(groundCheckInterval); // Interval'i kaydet
    }


    splash() {
        this.isSplashed = true;
        this.speedY = 0;
        
            //SISE KIRILMA SESI CAL
        AudioHub.bottle_break_sound.currentTime = 0;
        AudioHub.bottle_break_sound.volume = 0.3;
        AudioHub.bottle_break_sound.play().catch(e => {
            console.warn("Flaschen-Brunch-Sound konnte nicht angespielt werden:", e);
        });


        // Splash animasyonunun bitmesini bekle
    setTimeout(() => {
        this.intervalIds.forEach(id => clearInterval(id));
        
        // Şişe artık silinebilir işaretini koy
        this.canBeRemoved = true;
        }, 600);
    }
}
