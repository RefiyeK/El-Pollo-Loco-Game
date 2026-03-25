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
    * Creates a coin status display
    * Fixed position at x=180, y=0
    */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 180;
        this.y = 0;
        this.width = 150;
        this.height = 50;
        this.setPercentage(0); 
    }


     /**
     * Sets the percentage of collected coins
     * @param {number} collectedCoins - Number of collected coins
     */
    setPercentage(collectedCoins) {
        let percentage = (collectedCoins / 50) * 100; 
        this.collectedCoins = percentage;
        const index = collectedCoins > 0
            ? Math.max(1, this.resolveImageIndex(percentage))
            : 0;
        this.img = this.imageCache[this.IMAGES[index]];
    }

    
    /**
     * Determines the appropriate image index for the percentage
     * @param {number} percentage - Percentage of coins (0-100)
     * @returns {number} Index of the image to display (0-5)
     */
    resolveImageIndex(percentage) {
        if(percentage >= 100) return 5;
        if (percentage >= 80) return 4;
        if (percentage >= 60) return 3;
        if (percentage >= 40) return 2;
        if (percentage >= 20) return 1;
        return 0;
    }

}