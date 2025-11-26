class Coin extends MovableObject {
    width = 80;
    height = 80;
    initialY; // Başlangıç Y koordinatını saklamak için
    maxHeight =350; // Altının çıkabileceği maksimum yükseklik
    isMovingUp = true; // Başlangıçta yukarı doğru hareket eder
    verticalSpeed = 5; // Yukarı/aşağı hareket hızı

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor(x, y = 150) { // Varsayılan Y'yi 150 (zemin) olarak ayarladım
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.x = x;
        this.y = y;

        //Carpisma kutusu ayarlari
        this.offset = {
        top: 25,
        bottom: 25,
        left: 25,
        rifht: 25,
        }
        this.animate();
    }


    animate() {//Animasyon dönme efekti
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}