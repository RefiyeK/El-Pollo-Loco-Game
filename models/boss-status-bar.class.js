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
     * Creates a health display for the endboss
     * Shows boss energy as a status bar
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
     * Sets the percentage of boss health
     * Updates the displayed image accordingly
     * @param {number} health - Health in percent (0-100)
     */
    setPercentage(health) {
        this.percentage = health;
        let path = this.IMAGES_HEALTH_ENDBOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


    /**
     * Determines the appropriate image index for the health
     * @returns {number} Index of the image to display (0-5)
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