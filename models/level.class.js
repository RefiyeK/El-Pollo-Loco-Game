class Level {
    
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    level_end_x = 8400;


    /**
     * Creates a level with all game objects
     * @param {Array} enemies - Array of enemies (chickens, boss)
     * @param {Array} clouds - Array of clouds
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of collectable coins
     * @param {Array} bottles - Array of collectable bottles
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}