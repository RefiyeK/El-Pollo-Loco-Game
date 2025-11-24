class StatusBar extends DrawableObject {

    percentage = 100; //yüzdelik oran

    IMAGES_HEALTH_CHARACTER = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    constructor() {
        super(); //ruft von der das geerbt wird die construktorklasse
        this.loadImages(this.IMAGES_HEALTH_CHARACTER);
        this.x = 20;//can göstergesini sola yaklastiriyor
        this.y = 0; //can göstergesini yukari yaklastiriyor
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    setPercentage(percentage) { //statusbar yüzdesel
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH_CHARACTER[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
         if(this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }

}

class BossStatusBar extends DrawableObject {
    percentage = 100;

        //Büyük tavugun yara aldiginda durumu gösteren görseller
    IMAGES_HEALTH_ENDBOSS = [
        'img/7_statusbars/2_statusbar_boss/orange/0.png',
        'img/7_statusbars/2_statusbar_boss/orange/20.png',
        'img/7_statusbars/2_statusbar_boss/orange/40.png',
        'img/7_statusbars/2_statusbar_boss/orange/60.png',
        'img/7_statusbars/2_statusbar_boss/orange/80.png',
        'img/7_statusbars/2_statusbar_boss/orange/100.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_HEALTH_ENDBOSS);
        this.x = 500;
        this.y = 0;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    setPercentage(health) {
        this.percentage = health;
        let path = this.IMAGES_HEALTH_ENDBOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if(this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
        
}