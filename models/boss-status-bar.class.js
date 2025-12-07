class BossStatusBar extends DrawableObject {
    percentage = 100;

    IMAGES_HEALTH_ENDBOSS = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];


    /**
     * Erstellt eine Gesundheitsanzeige für den Endboss
     * Zeigt Boss-Energie als Statusbalken an
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH_ENDBOSS);
        this.x = 540;
        this.y = 6;
        this.width = 150;
        this.height = 50;
        this.setPercentage(100);
    }


    /**
     * Setzt den Prozentsatz der Boss-Gesundheit
     * Aktualisiert das angezeigte Bild entsprechend
     * @param {number} health - Gesundheit in Prozent (0-100)
     */
    setPercentage(health) {
        this.percentage = health;
        let path = this.IMAGES_HEALTH_ENDBOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Ermittelt den passenden Bild-Index für die Gesundheit
     * @returns {number} Index des anzuzeigenden Bildes (0-5)
     */
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
