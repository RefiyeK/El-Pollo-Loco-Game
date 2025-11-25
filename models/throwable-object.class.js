class ThrowableObject extends MovableObject {

    isSplashed = false; //Sise kirildi mi?

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

    constructor(x, y){
        super().loadImage(this.IMAGES_ROTATION[0]);//Ilk sise görseli
        this.loadImages(this.IMAGES_ROTATION); //Dönerken sise görselleri
        this.loadImages(this.IMAGES_SPLASH); //splash görseller

        this.x = x;
        this.y = y;
        this.height = 60; //sisenin yüksekligi
        this.width = 40; //sisenin genisligi
        this.trow();
    }


    trow() {
        this.speedY = 30; //bu hizda yukari ucsun diye sise
        this.applyGravity();

        //Her 25ms da saga hareket
        setInterval( () => {
            this.x += 10;
        }, 25);

        setInterval(() => {
            if(this.isSplashed) { //Sise kirildiysa splash animasyonu
                this.playAnimation(this.IMAGES_SPLASH);
            } else { //sise kirilmadiysa dönerken görseli göster
                this.playAnimation(this.IMAGES_ROTATION);
            }
        }, 100);
    }

        //Sise kirilma fonksiyonu
    splash() {
        this.isSplashed = true; //Sise kirildi splash baslat
    }
}