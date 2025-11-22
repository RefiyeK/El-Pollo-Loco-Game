class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 100;
    y = 320;
    height = 120;
    width = 100;

    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //döndürülmüs ekliyor resmi
    }

    
    drawFrame(ctx) {
        //Sadece ana karakter Pepe ve tavuk icin gecerli olan özel bir kural. 
        if(this instanceof Character || this instanceof Chicken) { // Etrafina yerlestirmis oldugumuz cerceve sadece ana karakterde ve tavuklarda var.
        //alttaki alan cercevenin olusturuldugu bölüm
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'white';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }
    
     //ön yükleme / preloading
    loadImages(arr) { //Method tanimladik. 
        arr.forEach((path) => {//Dizideki her bir resim yolunu tek tek dolaşmak için bir döngü başlatır. ve bu path degiskenine atanir
        let img = new Image();//Bellekte yepyeni, boş bir HTML Image (Görüntü) nesnesi oluşturulur.
        img.src = path;//Image nesnesinin kaynağı src = döngüden gelen resim yolu (path) ile ayarlanır.Tarayıcı arka planda resmi indirmeye başlar.
       
        this.imageCache[path] = img;//Resmi, ait olduğu sınıftaki önbelleğe kaydeder.
        });
    }

}