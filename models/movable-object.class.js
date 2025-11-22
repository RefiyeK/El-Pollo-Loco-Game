class MovableObject {
    x = 100;
    y = 320;
    img;
    height = 120;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0; //geschwindigkeit auf der Y Achse / Wie schnell das Objekt nach unten fällt
    acceleration = 2.5; //wie schnell das Objekt beschleunigt wird.


    applyGravity() { 
        setInterval(() => { //meine Funktion wird 25 mal pro Sekunde ausgeführt =1000/25=
           if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
           }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 90// Karakterin düstükten sonra nerede durmasi gerektigi yer
    }

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }


    //ön yükleme / preloading
    loadImages(arr) { //Method tanimladik. 
        arr.forEach((path) => {//Dizideki her bir resim yolunu tek tek dolaşmak için bir döngü başlatır. ve bu path degiskenine atanir
        let img = new Image();//Bellekte yepyeni, boş bir HTML Image (Görüntü) nesnesi oluşturulur.
        img.src = path;//Image nesnesinin kaynağı src = döngüden gelen resim yolu (path) ile ayarlanır.Tarayıcı arka planda resmi indirmeye başlar.
       
        this.imageCache[path] = img;//Resmi, ait olduğu sınıftaki önbelleğe kaydeder.
        });
    }

    playAnimation(images) {
        //Walk Animation
        let i = this.currentImage % this.IMAGES_WALKING.length; //let i=0 % 6; %=Mathematische rest
        //i=0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,0,.....
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

   moveRight() {
        this.x += this.speed;
        this.otherDirection = false; //saga tiklarsam resmi döndürme
    }

    moveLeft() {
            this.x -= this.speed; //x koordinattan 1 pixel azaltiyor
            this.otherDirection = true;//sola tiklarsam resmi döndür
    }

    jump() {
        this.speedY = 30; //ne kadar yüksege ziplayacagi belirli
    }
}
