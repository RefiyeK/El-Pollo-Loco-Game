class ThrowableObject extends MovableObject {


    constructor(x, y){
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 60; //sisenin yüksekligi
        this.width = 40; //sisenin genisligi
        this.trow();
    }


    trow() {
        this.speedY = 30; //bu hizda yukari ucsun diye sise
        this.applyGravity();
        setInterval( () => {
            this.x += 10;
        }, 25);
    }
}