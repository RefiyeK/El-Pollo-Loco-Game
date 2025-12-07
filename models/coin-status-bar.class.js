class CoinStatusBar extends DrawableObject {
    
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];
    collectedCoins = 0;

    
    /**
     * Erstellt eine Münz-Statusanzeige
     * Zeigt gesammelte Münzen als Balken an
     * @param {number} x - X-Position (wird ignoriert, nutzt feste Position)
     * @param {number} y - Y-Position (wird ignoriert, nutzt feste Position)
     */
    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES);
        this.x = 180;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        this.setPercentage(0); 
    }


     /**
     * Setzt den Prozentsatz der gesammelten Münzen
     * @param {number} collectedCoins - Anzahl der gesammelten Münzen
     */
    setPercentage(collectedCoins) {
        let percentage = (collectedCoins / 50) * 100; 
        this.collectedCoins = percentage;
        let path = this.IMAGES[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    
    /**
     * Ermittelt den passenden Bild-Index für den Prozentsatz
     * @param {number} percentage - Prozentsatz der Münzen (0-100)
     * @returns {number} Index des anzuzeigenden Bildes (0-5)
     */
    resolveImageIndex(percentage) {
        if(percentage >= 100) return 5;
        else if (percentage >= 80) return 4;
        else if (percentage >= 60) return 3;
        else if (percentage >= 40) return 2;
        else if (percentage >= 20) return 1;
        else return 0;
    }

}
