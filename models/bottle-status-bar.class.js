class BottleStatusBar extends DrawableObject {

    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];

    bottles = 0;


    /**
     * Erstellt eine Flaschen-Statusanzeige
     * Zeigt gesammelte Flaschen als Balken an
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
      
        this.x = 370;
        this.y = 0;
        this.width = 150;
        this.height = 50;
    }

    
    /**
     * Setzt die Anzahl der Flaschen
     * Aktualisiert das angezeigte Bild entsprechend
     * @param {number} bottles - Anzahl der gesammelten Flaschen
     */
    setBottles(bottles) {
        this.bottles = bottles;

        let percentage = (bottles / 10) * 100;
        let path = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    
    /**
     * Ermittelt den passenden Bild-Index für den Prozentsatz
     * @param {number} percentage - Prozentsatz der Flaschen (0-100)
     * @returns {number} Index des anzuzeigenden Bildes (0-5)
     */
    resolveImageIndex(percentage) {
        if(percentage === 100) return 5;
        if(percentage >= 80) return 4;
        if(percentage >= 60) return 3;
        if(percentage >= 40) return 2;
        if(percentage >= 20) return 1;
        return 0;
    }
}