class Endboss extends MovableObject {

    height = 400;
    width = 300;
    y = 70;
    health = 100; //Büyük tavuk baslangic sagligi
    isDead = false; //Büyük tavuk öldü mü? Baslangicta hayir
    isHurt = false; //Büyük tavuk yaralandi mi? Baslangicta hayir
    lastHit = 0; //En son hasar aldigi zaman

    IMAGES_WALKING = [ //YÜRÜYOR
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'    
    ];

    IMAGES_ALERT = [ //Karakterler karsilastiginda bu animasyona gecer
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [ //Büyük tavuk saldiriyor
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [ //Büyük tavuk hasar alinca
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [ //Büyük tavuk öldügü zaman
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]); //Yürürkenki ilk görsel
            //BURADA TÜM GÖRSELLERI BELLEGE EKLIYORUZ
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 7400; //tavugun olmasi gerektigi uzakli sonradan 7400 yap
        this.animate();
    }

   animate() {
    // ===== HER 200MS'DE GÖRSELİ DEĞİŞTİR =====
    setInterval(() => {
        if(this.isDead) {// Ölüm animasyonunu oynat (bitene kadar)
            this.playAnimation(this.IMAGES_DEAD);
            
            // Animasyon bittikten sonra son görselde kal
            if(this.currentImage >= this.IMAGES_DEAD.length) {
                this.currentImage = this.IMAGES_DEAD.length - 1;
            }
        }
        else if(this.isHurt) {
            this.playAnimation(this.IMAGES_HURT);
        }
        else if(this.checkIfCharacterInRange()) {
            this.playAnimation(this.IMAGES_ALERT);
        }
        else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 200);
    
    setInterval(() => {
         if(gameState.started && !gameState.paused) {
            if(!this.isDead) {
                if(!this.checkIfCharacterInRange()) {
                    this.moveLeft();
                }
            }
         }    
    }, 1000 / 60);
    
    //HER 500MS'DE YARALANMA KONTROL ET
    setInterval(() => {
        this.checkIfHurt();
    }, 500);
}



    //Büyük tavuk hasar almasi
    takeDamage(damage) {
        this.health -= damage; //sagliktan hasar düser. Her hasarda 20
        if(this.health < 0) { //eger saglik durumu 0 in altina düserse 0 da kalsin diyoruz
            this.health = 0; //burada saglik durumunun 0 dan az olmamasini söylüyoruz
        }

        this.isHurt = true; //Büyük tavuk yaralandiysa
        this.lastHit = new Date().getTime(); //suanki zamani kaydet

        if(this.health === 0) { //eger saglik 0 olduysa, öldür
            this.isDead = true; //büyük tavuk öldü
        }
    }

    checkIfHurt() {
        // suanki zaman - en son hit zamani = 100ms dan büyükse 
        if(new Date().getTime() - this.lastHit > 100) {
            this.isHurt = false; //yaralanma efektini bitir
        }
    }

    checkIfCharacterInRange() { //Büyük tavuk karaktere yakin mi kontrol et
        let distance = Math.abs(this.x - this.world.character.x);//Mesafe hesaplaniyor
        if(distance < 400) { //eger 400px den az ise
            return true; //karakter yakin alert durumuna gec
        }else { //karakter uzaksa
            return false; //yürümeye devam
        }
    }
}