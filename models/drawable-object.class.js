class DrawableObject {
    img; //Görsel burada saklanir
    imageCache = {}; //Birden fazla görsel icin
    currentImage = 0;
    x = 100;
    y = 320;
    height = 120;
    width = 100;

    
    loadImage(path) {
        this.img = new Image(); //Bos bir resim objesi olusturur
        this.img.src = path; //Tarayiciya, bu yoldaki resmi yükle diyoruz.
    }
    
    draw(ctx) { //Görsel yüklenmis ve kullanilabilir mi kontrol et
        if(this.img && this.img.complete && this.loadImage.naturalHeight !== 0) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //döndürülmüs ekliyor resmi
        }
    }

    //KARAKTER VE CISIMLERIN ETRAFINA CIZIM
    drawFrame(ctx) {
        const DEBUG_MODE = false; //False kutulari kaldirmak icin. Tekrar görünsün istiyorsan True yap
        if(!DEBUG_MODE) return;
    //TÜM OBJELERİN çarpışma kutusunu göster (test için)
    ctx.beginPath();
    ctx.lineWidth = '3';
    
    // Farklı objeler için farklı renkler
    if(this instanceof Character) {
        ctx.strokeStyle = 'blue';  // Karakter mavi
    } else if(this instanceof Chicken || this instanceof ChickenBaby) {
        ctx.strokeStyle = 'red';   // Tavuklar kırmızı
    } else if(this instanceof ThrowableObject) {
        ctx.strokeStyle = 'green'; // Şişeler yeşil
    } else if(this instanceof Endboss) {
        ctx.strokeStyle = 'orange'; // Boss turuncu
    } else {
        ctx.strokeStyle = 'white'; // Diğerleri beyaz
    }
    

        //OFFSET CARPISMA KUTUSUNU CIZ
    if(this.offset) {
    ctx.rect(
        this.x + this.offset.left, //Sol taraftan offset kadar iceri
        this.y + this.offset.top , //Üstten offset kadar asagi
        this.width - this.offset.left - this.offset.right, //Genislikten offsetleri cikart
        this.height - this.offset.top - this.offset.bottom //Yükseklikten offsetleri cikar
        );
    } else { //Offset yoksa normal ciz
        ctx.rect(this.x, this.y, this.width, this.height);
    }
    ctx.stroke();
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