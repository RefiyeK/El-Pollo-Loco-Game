class Level {
    
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 8400;


    /**
     * Erstellt ein Level mit allen Spielobjekten
     * @param {Array} enemies - Array von Gegnern (Hühner, Boss)
     * @param {Array} clouds - Array von Wolken
     * @param {Array} backgroundObjects - Array von Hintergrund-Objekten
     * @param {Array} coins - Array von sammelbaren Münzen
     * @param {Array} bottles - Array von sammelbaren Flaschen
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}