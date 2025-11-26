class CoinStatusBar extends DrawableObject {
    
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png', //0 coin
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png', //10 coin
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png', //20 coin
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png', //30 coin
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png', //40 coin
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png' //50 coin
    ];
    collectedCoins = 0; //Toplanan altin sayisini tutar

    
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES); //Resimleri yüklüyoruz
        this.x = x;
        this.y = y;
        this.width = 200; //genislik
        this.height = 50; //yükseklik
        this.setPercentage(0); //baslangicta 0 altin ile basliyoruz
    }

    setPercentage(collectedCoins) {
        let percentage = (collectedCoins / 50) * 100; //percentage tanimladik
        this.collectedCoins = percentage;
        let path = this.IMAGES[this.resolveImageIndex(percentage)]; //yüzdeye denk gelen resmi bul
        this.img = this.imageCache[path]; //resmi yükle
    }

    resolveImageIndex(percentage) {//Yüzdesel degere göre resmi bulup gösterir
        if(percentage >= 100) return 5; //50 coin 100%
        else if (percentage >= 80) return 4;//40 coin 80%
        else if (percentage >= 60) return 3;//30 coin 60%
        else if (percentage >= 40) return 2;//20 coin 40%
        else if (percentage >= 20) return 1;//10 coin 20%
        else return 0;//hic coin yok 0%
    }

}


// setPercentage(percentage) {
//         this.coins = percentage; //yüzdesel bilgi
//         let path = this.IMAGES[this.resolveImageIndex(percentage)]; //yüzdeye denk gelen resmi bul
//         this.img = this.imageCache[path]; //resmi yükle
//     }

//     resolveImageIndex(percentage) {//Yüzdesel degere göre resmi bulup gösterir
//         if(percentage >= 100) return 5;
//         else if (percentage >= 80) return 4;
//         else if (percentage >= 60) return 3;
//         else if (percentage >= 40) return 2;
//         else if (percentage >= 20) return 1;
//         else return 0;
//     }