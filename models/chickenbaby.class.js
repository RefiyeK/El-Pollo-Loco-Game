class ChickenBaby extends MovableObject {

//civciv ebatlari
width = 30;
height = 40;
y= 395;
isDead = false; //civciv öldü mü

//Carpisma tespiti. Civcivinki daha kücük
offset = {
    top : 10, //üst carpisma
    bottom : 10, //alt carpisma
    left : 5, //sol carpisma
    right : 5, //sag carpisma
}

//civciv yürüyüs görselleri
IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
];


IMAGES_DEAD = [
    'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
];

constructor() {
    super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png'); //ilk görsel yüklendi
    this.loadImages(this.IMAGES_WALKING); //tüm görselleri bellege yükle
    this.loadImages(this.IMAGES_DEAD); //ölüm görseli bellege yükle

    this.x = 200 + Math.random() * 500; // xkonumu rastgele 200-700 arasi koy
    this.speed = 0.1 + Math.random() * 0.3; //civciv tavuktan daha yavas hareket ediyor
    this.animate(); //animasyonu baslat
}

animate() {
    setInterval(() => {
        if(gameState.started && !gameState.paused) { //oyun basladiysa ve oyun arada degilse
            if(!this.isDead) { //eger civciv ölü degilse
                this.moveLeft(); //sola hareket et
                this.otherDirection = false; //yüzü sola baksin
            }
        }
    }, 1000 / 60); 

    setInterval(() => {
        if(gameState.started && !gameState.paused) { //oyun basladiysa ve ara verilmediginde
            if(this.isDead) { //civciv ölüyse
                this.playAnimation(this.IMAGES_DEAD);//ölü görseli göster
            } else { // aksi taktirde
            this.playAnimation(this.IMAGES_WALKING); //yürüyüs animasyonuna devam et
            }
        }    
    }, 200); //her 200 ms da görseli degistir
}


}