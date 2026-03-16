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
     * Creates a health display for the character
     * Shows energy level as a status bar
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
     * Sets the percentage of health
     * Updates the displayed image accordingly
     * @param {number} percentage - Health in percent (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_HEALTH_CHARACTER[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
    * Determines the appropriate image index based on health percentage
    * Returns the correct image for each health level including 0%
    * @returns {number} Index of the image to display (0-5)
    */
    resolveImageIndex() {
        if(this.percentage == 100) {
            return 5;  // 100% health - full bar
        } else if(this.percentage >= 80) {
            return 4;  // 80% health
        } else if(this.percentage >= 60) {
            return 3;  // 60% health
        } else if(this.percentage >= 40) {
            return 2;  // 40% health
        } else if(this.percentage >= 20) {
            return 1;  // 20% health
        } else {
            return 0;  // 0% health - EMPTY BAR! ✅
        }
    }
}