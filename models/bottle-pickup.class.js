class BottlePickup extends MovableObject {

    width = 50;
    height = 40;
    y = 400; //yerde durur
    isCollected = false;

    IMAGES = [ //Bu bir class özelligi
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ]

    constructor(x) {
        super(); //Önce süper cagir
        //0 veya 1 döner. Yani yukaridaki iki resimden alir *2 0 ile 2 arasinda döner.
        //Burada floor asagiya dogru yuvarla demek.Yani virgülden önceki kismi al 
        let randomIndex = Math.floor(Math.random() * this.IMAGES.length);         
        
        this.loadImage(this.IMAGES[randomIndex]);
        this.x = x; //koordinati level1 dosyasindan geliyor
    }
}