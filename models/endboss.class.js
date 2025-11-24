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
        this.x = 7400;
        this.animate();
    }

    animate() {
        setInterval( () => { 
            //Her 200 ms`de görseli degistir
            if(this.isDead) { //büyük tavuk öldüyse ölüm animasyonu oynat
                this.playAnimation(this.IMAGES_DEAD);
            }else if (this.isHurt) { //eger büyük tavuk yaralandiysa, yaralanma animasyonunu oynat
                this.playAnimation(this.IMAGES_HURT);
            }else if (this.checkIfCharacterInRange()) { //Karakter yakinlasmissa alert animasyonuna gec
                this.playAnimation(this.IMAGES_ALERT);
            } else {    //ölü degilse normal animasyonu oynat
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        setInterval(() => {
            if(gameState.started && !gameState.paused) { //oyun basladiysa VE ara verilmediyse
                if(!this.isDead) { //Büyük tavuk ölmediyse
                    if(!this.checkIfCharacterInRange()) { //Karakter yakinda degilse
                        this.moveLeft();//sola dogru yürü
                        }
                    }
            }
        }, 1000 / 60); //dakikada 60 kez hareket et

        setInterval(() => {
            this.CheckIhHurt(); //Eger yaralanma efekti bittiyse, false yap
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

    CheckIhHurt() {
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