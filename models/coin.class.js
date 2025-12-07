class Coin extends MovableObject {
    width = 80;
    height = 80;
    initialY;
    maxHeight =350;
    isMovingUp = true;
    verticalSpeed = 5;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];


    /**
     * Erstellt eine sammelbare Münze
     * @param {number} x - X-Position der Münze
     * @param {number} y - Y-Position der Münze (Standard: 150)
     */
    constructor(x, y = 150) {
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


    /**
     * Startet die Münz-Animation
     * Wechselt zwischen zwei Bildern für Glitzer-Effekt
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}