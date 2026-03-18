class ChickenBaby extends BaseChicken {

    width = 30;
    height = 40;
    y = 395;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];


    /**
     * Creates a baby chicken at a random position
     */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 700 + Math.random() * 7000;
        this.speed = 0.1 + Math.random() * 0.3;
        this.energy = 1;
        this.offset = { top: 0, bottom: 0, left: 0, right: 0 };
    }
}