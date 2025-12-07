class BossStatusBar extends DrawableObject {
    percentage = 100; //Bosun baslangic can yüzdesi

    IMAGES_HEALTH_ENDBOSS = [//Bosun can durumunu gösteren görseller
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png', //ölü
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png', //20% can var
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png', //40% can var
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png', //60% can var
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png', //80% can var
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png' //100% can- tam dolu
    ];

    constructor() { //yeni bir bos status bar olusturuldugunda calisir
        super(); //DrawableObject sinifinin consructor ini cagirir
        this.loadImages(this.IMAGES_HEALTH_ENDBOSS); //Tüm görselleri bellege yükle
        this.x = 540; // Sağ üstte görünecek
        this.y = 6; //Ekranin en üstünde
        this.width = 150; //Status bar`in boyutlari genislik
        this.height = 50; //Status bar`in boyutlari yükseklik
        this.setPercentage(100); //Baslangicta 100% can ile basliyor
    }

        //Bos`un canini güncelleme metode
    setPercentage(health) {//Parametre= health: Bos`un güncel can miktari
        this.percentage = health; //Gelen can miktarini sakla
        //Can yüzdesine göre hangi görseli gösterecegimizi bul
        let path = this.IMAGES_HEALTH_ENDBOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];//Bulunan görseli ekrana ciz (imageCache`den al)
    }

        //Can yüzdesine göre hangi görsel index`ini kullanacagimizi belirler
    resolveImageIndex() {
        if(this.percentage == 100) { //Eger can 100% ise
            return 5; //Array`in 5. elemanini
        } else if (this.percentage > 80) { //Eger can 80% den fazla ise
            return 4; //Array`in 4. elemanini
        } else if (this.percentage > 60) { //Eger can 60% den fazla ise
            return 3; //Array`in 3. elemanini
        } else if (this.percentage > 40) { //Eger can 40% den fazla ise
            return 2; //Array`in 2. elemanini
        } else if (this.percentage > 20) { //Eger can 20% den fazla ise
            return 1; //Array`in 1. elemanini
        } else { //Eger can 20% den az ise 
            return 0; //Array`in 0. elemanini
        }
    }
}
