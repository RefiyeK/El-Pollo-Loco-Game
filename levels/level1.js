
/**
 * Erstellt das erste Level des Spiels
 * Beinhaltet alle Gegner, Wolken, Hintergründe, Münzen und Flaschen
 * 
 * Level-Aufbau:
 * - 10 normale Hühner
 * - 9 Baby-Hühner
 * - 1 Endboss
 * - 37 Wolken für Atmosphäre
 * - Mehrschichtige Hintergründe (Luft, 3 Ebenen)
 * - 50 Münzen zum Sammeln
 * - 20 Flaschen zum Sammeln
 * 
 * @returns {Level} Das konfigurierte Level-Objekt
 */
function createLevel1() {
    return new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new Endboss(),
    ],
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud()
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png',-719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
    

        new BackgroundObject('img/5_background/layers/air.png',0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png',719),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png',719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/air.png',719*3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),

        new BackgroundObject('img/5_background/layers/air.png',719*4),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/air.png',719*5),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*5),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*5),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*5),

        new BackgroundObject('img/5_background/layers/air.png',719*6),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*6),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*6),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*6),
        new BackgroundObject('img/5_background/layers/air.png',719*7),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*7),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*7),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*7),

        new BackgroundObject('img/5_background/layers/air.png',719*8),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*8),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*8),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*8),
        new BackgroundObject('img/5_background/layers/air.png',719*9),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*9),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*9),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*9),
        
        new BackgroundObject('img/5_background/layers/air.png',719*10),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*10),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*10),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*10),
        new BackgroundObject('img/5_background/layers/air.png',719*11),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*11),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*11),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*11),

        new BackgroundObject('img/5_background/layers/air.png',719*12),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*12),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*12),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*12),
        new BackgroundObject('img/5_background/layers/air.png',719*13),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*13),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*13),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*13)
    ],
    [
        new Coin(460, 350),
        new Coin(500, 300),
        new Coin(540, 250),
        new Coin(580, 200),
        new Coin(620, 150),
        new Coin(660, 140),
        new Coin(700, 150),
        new Coin(740, 200),
        new Coin(780, 250),
        new Coin(820, 300),
        new Coin(860, 350),

        new Coin(1200, 400),
        new Coin(1250, 400),
        new Coin(1300, 400),
        new Coin(1350, 400),
        new Coin(1400, 400),
        new Coin(1450, 400),

        new Coin(1600, 150),
        new Coin(1650, 150),
        new Coin(1700, 150),

        new Coin(2500, 350),
        new Coin(2540, 300),
        new Coin(2580, 250),
        new Coin(2620, 200),
        new Coin(2660, 150),
        new Coin(2700, 140),
        new Coin(2740, 150),
        new Coin(2780, 200),
        new Coin(2820, 250),
        new Coin(2860, 300),
        new Coin(2900, 350),

        new Coin(3650, 400),
        new Coin(3700, 400),
        new Coin(3750, 400),
        new Coin(3800, 400),
        new Coin(3850, 400),
        new Coin(3900, 400),

        new Coin(4000, 150),
        new Coin(4050, 150),
        new Coin(4100, 150),

        new Coin(4600, 400),
        new Coin(4650, 400),
        new Coin(4700, 400),

        new Coin(5550, 150),
        new Coin(5600, 150),
        new Coin(5650, 150),

        new Coin(6500, 400),
        new Coin(6550, 400),
        new Coin(6600, 400),
        new Coin(6650, 400),


    ],

    [
        new BottlePickup(500),
        new BottlePickup(800),
        new BottlePickup(1200),
        new BottlePickup(1500),
        new BottlePickup(2000),
        new BottlePickup(2300),
        new BottlePickup(2800),
        new BottlePickup(3200),
        new BottlePickup(3600),
        new BottlePickup(4000),
        new BottlePickup(4300),
        new BottlePickup(4600),
        new BottlePickup(4900),
        new BottlePickup(5300),
        new BottlePickup(5600),
        new BottlePickup(5900),
        new BottlePickup(6400),
        new BottlePickup(6700),
        new BottlePickup(7000),
        new BottlePickup(7300),
    ]
    );
}