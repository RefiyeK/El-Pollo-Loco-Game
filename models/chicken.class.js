class Chicken extends MovableObject { 

    width = 50;
    height = 70;
    y = 400; 
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5; //Tavuklarin hepsi -random- degisik hizda yürüyecek. Math.random()=Zufällige Zahl zwischen 0-1
        this.animate();
    }
   

  animate() {
        setInterval( () => { //tavuk görünür görünmez dünyada animate fonksiyonunu üstleniyor.
            this.moveLeft(); //saniyede 60 kere sola hareket etsin.
            this.otherDirection = false; //saga tiklarsam resmi döndürme
        },1000 / 60); //ne kadar sik tekrarlamasi gerektigi. 0.15px eksiltme 1 dk da 60 kez gerceklesiyor.

        setInterval (() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}