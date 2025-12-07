class BottleStatusBar extends DrawableObject {

    IMAGES = [ //SIse göstergesi görselleri
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    bottles = 0; //Baslangicta 0 sise var

    constructor() {
        super(); //DrawableObject`in constructor`ini cagir
        this.loadImage(this.IMAGES[0]);//bos sise göstergesi
        this.loadImages(this.IMAGES); //Sonra tüm görselleri bellege kaydet
        
        //status bar`in konumu
        this.x = 370;//x kordinati
        this.y = 0; //y kordinati

        //status bar`in boyutlari
        this.width = 150; //Genislik
        this.height = 50; //Yükseklik

    }


        //Sise sayisinin güncelleme metodu
        setBottles(bottles) {
            this.bottles = bottles; //sise sayisini kaydet

            let percentage = (bottles / 10) * 100; //Yüzdeyi hesaplama (10 sise = 100%)
            let path = this.IMAGES[this.resolveImageIndex(percentage)];//Yüzdeye göre hangi görseli gösterecegimizi bul
            this.img = this.imageCache[path]; //Bulunan görseli ekrana ciz
        }


        //Yüzdeye göre hangi görsel index`ini kullanacagimizi belirler
        resolveImageIndex(percentage) {
            if(percentage === 100) {
                return 5;
            } else if(percentage >= 80 ) {
                return 4;
            } else if (percentage >= 60) {
                return 3;
            } else if (percentage >= 40) {
                return 2;
            } else if(percentage >= 20) {
                return 1;
            }else {
                return 0;
            }
        }


}