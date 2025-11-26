class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0; //geschwindigkeit auf der Y Achse / Wie schnell das Objekt nach unten fällt
    acceleration = 2.5; //wie schnell das Objekt beschleunigt wird.
    energy = 100; //toplam sahip oldugu can
    lastHit = 0;
    

    applyGravity() { 
        setInterval(() => { //meine Funktion wird 25 mal pro Sekunde ausgeführt =1000/25=
           if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
           }
        }, 1000 / 25);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject) { // Eğer fırlatılabilir bir nesneyse (örneğin şişe), her zaman yerin üstündedir
            return true;    
        } 
        if(this instanceof Coin) {
        return this.y < 150// Belirli bir yükseklikten (zemin) yukarıda olup olmadığını kontrol eder.
         }
         return this.y < 150 // Karakterin düştükten sonra nerede durmasi gerektigi yer
    }

    isColliding(mo) {
        return this.x + this.width > mo.x && // 'Bu' nesnenin sağ kenarı, 'mo' nesnesinin sol kenarını geçti mi?
            this.x < mo.x + mo.width && // 'Bu' nesnenin sol kenarı, 'mo' nesnesinin sağ kenarından önce mi?
            this.y + this.height > mo.y && // 'Bu' nesnenin alt kenarı, 'mo' nesnesinin üst kenarını geçti mi?
            this.y < mo.y + mo.height; // 'Bu' nesnenin üst kenarı, 'mo' nesnesinin alt kenarından önce mi?
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

