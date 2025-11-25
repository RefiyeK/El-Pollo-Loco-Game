const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenBaby(),
        new ChickenBaby(),
        new ChickenBaby(),
        new Endboss()
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
        new BackgroundObject('img/5_background/layers/air.png',-719), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
    

        new BackgroundObject('img/5_background/layers/air.png',0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/air.png',719), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

        new BackgroundObject('img/5_background/layers/air.png',719*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*2),
        new BackgroundObject('img/5_background/layers/air.png',719*3), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*3),

        new BackgroundObject('img/5_background/layers/air.png',719*4),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*4),
        new BackgroundObject('img/5_background/layers/air.png',719*5), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*5),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*5),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*5),

        new BackgroundObject('img/5_background/layers/air.png',719*6),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*6),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*6),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*6),
        new BackgroundObject('img/5_background/layers/air.png',719*7), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*7),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*7),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*7),

        new BackgroundObject('img/5_background/layers/air.png',719*8),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*8),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*8),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*8),
        new BackgroundObject('img/5_background/layers/air.png',719*9), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*9),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*9),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*9),
        
        new BackgroundObject('img/5_background/layers/air.png',719*10),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*10),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*10),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*10),
        new BackgroundObject('img/5_background/layers/air.png',719*11), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*11),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*11),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*11),

        new BackgroundObject('img/5_background/layers/air.png',719*12),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719*12),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719*12),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719*12),
        new BackgroundObject('img/5_background/layers/air.png',719*13), //canvas in bittigi yer orada tekrar resmi baslatiyoruz
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719*13),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719*13),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719*13)
    ],
    [
        new Coin(500),
        new Coin(1000),
        new Coin(1500),
        new Coin(2500),
        new Coin(3500),
        new Coin(4500),
        new Coin(5500),
        new Coin(6500)
    ],

    [
        new BottlePickup(600),
        new BottlePickup(1200),
        new BottlePickup(2000),
        new BottlePickup(3000),
        new BottlePickup(4000),
        new BottlePickup(5000),
        new BottlePickup(6000)
    ]

);