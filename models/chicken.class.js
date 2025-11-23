class Chicken extends MovableObject { 

    width = 50;
    height = 80;
    y = 360;
    x = 490;
    isDead = false; //tavuk öldü mü?

    offset = {
        top: 120,
        bottom :30,
        left : 40,
        right : 40
    }
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_DEAD);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5; //Tavuklarin hepsi -random- degisik hizda yürüyecek. Math.random()=Zufällige Zahl zwischen 0-1
        this.animate();
    }
   

  animate() {
        setInterval( () => {
            // Oyun başladıysa ve pause değilse hareket et
           if (gameState.started && !gameState.paused) {
                if(!this.isDead) { //Eger ölüyse hareket etme   
                    this.moveLeft(); //saniyede 60 kere sola hareket etsin.
                    this.otherDirection = false;
                }
            }
        },1000 / 60); //ne kadar sik tekrarlamasi gerektigi. 0.15px eksiltme 1 dk da 60 kez gerceklesiyor.
            
        setInterval (() => {
            // Oyun başladıysa ve pause değilse animasyon oynat
            if (gameState.started && !gameState.paused) {
                if(this.isDead) {//eger civciv ölmüsse
                    this.playAnimation(this.IMAGES_DEAD); //ölüm görseli göster
                } else { //aksi takdirde
                    this.playAnimation(this.IMAGES_WALKING); //yürüyüs görseline devam
                }
            }
        }, 200);
    }
}
