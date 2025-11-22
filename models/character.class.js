class Character extends MovableObject{
    
    
    height = 390;
    y = 10;
    speed = 10;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];


    world;
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.applyGravity();
        this.animate();
    }

    animate() {
        
        setInterval(() => {
            //BURAYA YÜRÜRKEN CIKARMASI GEREK MÜZIK  this.walking_sound.pause();GELMELI!!!!!
            if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
               this.moveRight();
               //BURAYA YÜRÜRKEN CIKARMASI GEREK MÜZIK this.walking_sound.play(); GELMELI!!!!!
            }    

            if(this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft(); //sola gitme tusuna basar basmaz ve x kordinatlarinin icinde oldugu sürece sola hareket etmeli.
                 //BURAYA YÜRÜRKEN CIKARMASI GEREK MÜZIK this.walking_sound.play(); GELMELI!!!!!
            }
            
            if
            (this.world.keyboard.UP && !this.isAboveGround() || this.world.keyboard.SPACE && !this.isAboveGround()){ //Yukari tusuna bastigimizda ve havada degilse
                this.jump(); //movable icinde belirledigimiz ne kadar yukari ziplasin`i burada cagirmis olduk.
            }

            this.world.camera_x = -this.x + 100; //nereye gidersem git hep tam tersine it
        }, 1000 / 60); //60 mal pro Sekunde
        
        
        setInterval( () => { 

            if(this.isAboveGround()){
               this.playAnimation(this.IMAGES_JUMPING);
            } else {

                if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {//sadece saga ya da sola gitme tusuna basarsam gitsin.
                this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
        
    }
    
    jump() {
        this.speedY = 30; //ne kadar yüksege ziplayacagi belirli
    }
}