class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0; //geschwindigkeit auf der Y Achse / Wie schnell das Objekt nach unten fällt
    acceleration = 2.5; //wie schnell das Objekt beschleunigt wird.
    energy = 100; //toplam sahip oldugu can
    lastHit = 0;
    // offset = {
    //     top: 0,
    //     left : 0,
    //     right : 0,
    //     bottom : 0
    // }

    applyGravity() { 
        setInterval(() => { //meine Funktion wird 25 mal pro Sekunde ausgeführt =1000/25=
           if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
           }
        }, 1000 / 25);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject) {
            return true;    
        } else {
        return this.y < 150// Karakterin düstükten sonra nerede durmasi gerektigi yer
         }
    }


    //Collision Detection/Carpisma Tespiti
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }

    hit() { //Karakterin ne kadar neerji/can kaybettigini belirliyor
        this.energy -= 5; //ne kadar can kaybettigi yazili
        if (this.energy < 0) {
            this.energy = 0;
        }else {
            this.lastHit = new Date().getTime(); //zamanin ramak bakimindan yazilmasi
        }
        }


    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //en son düsmanla karsilastigimiz an = difference in ms
        timepassed = timepassed / 1000;// difference in s
        return timepassed < 1; // son 1 sn icinde hasar aldiysak/carpisma olduysa SONUC TRUE o zaman IMAGES_HURT resmi cikiyor
    }

    isDead() {
        return this.energy == 0;  
    }

   

    playAnimation(images) {
        //Walk Animation
        let i = this.currentImage % images.length; //let i=0 % 6; %=Mathematische rest
        //i=0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,0,.....
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

   moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
            this.x -= this.speed; //x koordinattan 1 pixel azaltiyor
    }

    // jump() {
    //     this.speedY = 30; //ne kadar yüksege ziplayacagi belirli
    // }



}

