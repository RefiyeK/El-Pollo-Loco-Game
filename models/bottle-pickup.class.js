class BottlePickup extends MovableObject {

    width = 50;
    height = 40;
    y = 180; //yerde durur

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    constructor(x) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);

        this.x = x;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 200);
    }
}