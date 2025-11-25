class Coin extends MovableObject {
    width = 30;
    height = 30;
    y= 150; //baslangicta havada

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.x = x;
        this.speedY = 20; //Yukari cikma hizi
        this.applyGravity();
        this.animate();
    }


    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}