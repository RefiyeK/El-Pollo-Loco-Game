class MovableObject {
    x = 100;
    y = 320;
    img;
    height = 120;
    width = 100;
    imageCache = [];
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;

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
        console.log('Moving right');
    }

    moveLeft() {
        setInterval( () => {
            this.x -= this.speed; //x koordinattan 1 pixel azaltiyor
        },1000 / 60); //ne kadar sik tekrarlamasi gerektigi. 0.15px eksiltme 1 dk da 60 kez gerceklesiyor.
    }
}