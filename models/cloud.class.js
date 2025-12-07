class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;
    

    /**
     * Erstellt eine bewegliche Wolke
     * Wolke startet an zufälliger X-Position
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 7000;
        this.speed = 0.2;
        this.animate();
    }


    /**
     * Startet die Wolken-Bewegung
     * Wolke bewegt sich kontinuierlich nach links
     */
    animate() {
        setInterval(() => {
        if(!isGameActive()) return;
            this.moveLeft();
        }, 1000 / 60);
    }
}