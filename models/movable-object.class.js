class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0; //geschwindigkeit auf der Y Achse / Wie schnell das Objekt nach unten fällt
    acceleration = 2.5; //wie schnell das Objekt beschleunigt wird.
    energy = 100; //toplam sahip oldugu can
    lastHit = 0;
    

    applyGravity() { 
        setInterval(() => {
            if(!isGameActive()) return;

           if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
           }
        }, 1000 / 25);
    }

    isAboveGround() {
        if(this instanceof ThrowableObject) { // Eğer fırlatılabilir bir nesneyse (örneğin şişe), her zaman yerin üstündedir
            return this.y < 360; //360 = zemin seviyesi    
        } 
        if(this instanceof Coin) {
        return this.y < 150// Belirli bir yükseklikten (zemin) yukarıda olup olmadığını kontrol eder.
         }
         return this.y < 150 // Karakterin düştükten sonra nerede durmasi gerektigi yer
    }

    isColliding(mo) {

        //Eger offset yoksa varsayilan degerler kullan (0)
        //this.offset?.left = Sisenin soldan offset`i var mi? Varsa al
        // ||0 = Yoksa sifir kullan
        let thisOffsetLeft = this.offset?.left || 0;
        let thisOffsetRight = this.offset?.right || 0;
        let thisOffsetTop = this.offset?.top || 0;
        let thisOffsetBottom = this.offset?.bottom || 0;

        let moOffsetLeft = mo.offset?.left || 0;
        let moOffsetRight = mo.offset?.right || 0;
        let moOffsetTop = mo.offset?.top || 0;
        let moOffsetBottom = mo.offset?.bottom || 0;

        
        //Offset`li carpisma kontrolü
        return (
        //this.x = sisenin sol kenari (0 noktasi)
        //this.x + this.width = Sisenin sag kenari
        //mo.x = Boss`un sol kenari
        //mo.x + mo.width = Boss`un sag kenari

            //this.x + thisOffsetLeft = Sisenin gercek sol kenari (sisex(7350) + offset left(5) = GERCEK SOL KENAR=7355)
            //this.width - thisOffsetLeft - thisOffsetRight = sise genislik(40)-offset left(5)-right(5)= SISENIN GERCEK GENISLIK=30
            //this.x + thisOffsetLeft + gercek genislik= Sisenin gercek sag kenari (sol kenar 7355 + genislik 30 = 7385)
            //mo.x + moOffsetLeft = Boss`n gercek sol kenari (BossX 7400 + Boss offsetleft 0 = Boss`un gercek sol kenar 7400+0=7400)
            //7385 > 7400 = Sisenin sag kenari Boss`un sol kenarindan büyük mü? = HAYIR -> Henüz carpmadi  
            this.x + thisOffsetLeft + (this.width - thisOffsetLeft - thisOffsetRight) > mo.x + moOffsetLeft && // Sag kenar kontrolü
            this.x + thisOffsetLeft < mo.x + moOffsetLeft + (mo.width - moOffsetLeft - moOffsetRight) && // Sol kenar kontrolü
            this.y + thisOffsetTop + (this.height - thisOffsetTop - thisOffsetBottom) > mo.y + moOffsetTop && // Alt kenar kontrolü
            this.y + thisOffsetTop < mo.y + moOffsetTop + (mo.height - moOffsetTop - moOffsetBottom) // Üst kenar kontrolü
        );
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
}

