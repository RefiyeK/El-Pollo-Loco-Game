class StatusBar extends DrawableObject {

    percentage = 100;

    IMAGES_HEALTH_CHARACTER = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];


    /**
     * Erstellt eine Gesundheitsanzeige für den Charakter
     * Zeigt Energie-Level als Statusbalken an
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_HEALTH_CHARACTER);
        this.x = 20;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        this.setPercentage(100);
    }


    /**
     * Setzt den Prozentsatz der Gesundheit
     * Aktualisiert das angezeigte Bild entsprechend
     * @param {number} percentage - Gesundheit in Prozent (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH_CHARACTER[this.resolveImageIndex()];
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
