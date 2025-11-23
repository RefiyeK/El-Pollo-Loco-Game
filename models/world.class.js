class World {
    character = new Character();
    level = level1;  
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Burada arka planin ilerledikce kaymasini söylüyoruz
    statusBar = new StatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

    run() {
        setInterval(() => {
         this.checkCollisions();
         this.checkThrowObjects();

         if(gameState.gameOver) {
            this.showGameOver();
         }
        }, 200);    
    }

    checkThrowObjects() {
        if(this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y +100);//kordinatlari karakterin kordinatlariyla ayni
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {

        // if(gameState.gameOver){// Eğer oyun zaten bitiyse,yani karakterin cani kalmadiysa çarpışma kontrolü yapma
        //     return;
        // }

        this.level.enemies.forEach( (enemy) => {
            if(this.character.isColliding(enemy) ) {
                this.character.hit(); //hit te karakterin kaybettigi can orani belirli
                this.statusBar.setPercentage(this.character.energy);
                
            if(this.character.isDead()) { //karakter öldügünde
                gameState.gameOver = true; //Oyun bitti veriyoruz
                }        
            }
        });

        //Tavuk civciv ziplama
        this.level.enemies.forEach((enemy) => { //tüm düsmanlari tek tek kontrol et
            if(enemy.isDead) { //düsman öldüyse kontrol etme
                return;
            }

        //Hepsi dogru olmali =Karakter havada mi? = Karakter iniste mi? = Düsmana carpti mi?
        if(this.character.isAboveGround() && 
            this.character.speedY < 0 && 
            this.character.isColliding(enemy)) {
            enemy.isDead = true; //düsman öldür
            
            let index = this.level.enemies.indexOf(enemy); //düsmani arrayda ara bul
            if(index > -1) {
                this.level.enemies.splice(index,1); //arrayden cikart
            }

            //karakteri biraz yukari atla. Ziplamis gibi görünsün
            this.character.speedY = 15;
        }
        });


    }






    draw() { //
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.camera_x, 0); //kamerayi sola dogru kaydiriyor
        this.addObjectsToMap(this.level.backgroundObjects);

        //Burada can göstergesinin devamli üst kösede kalmasini sagladik. Yani fixledik
        this.ctx.translate(-this.camera_x, 0); //kamerayi sola kaydirmayi geri aliyor / Back
        this.addToMap(this.statusBar); //statusbar ekledik
        this.ctx.translate(this.camera_x, 0); //kamerayi sola dogru kaydirmayi tekrar yaptiriyor / Forwards


        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);//Burada arka plani daga kaydiriyoruz
       
            
        let self = this; //Draw() wird immer wieder aufgerufen
            requestAnimationFrame(function() { //buraya bir funktion vermemiz gerekiyor. Yukaridaki olur olmaz isleme geciyor.
                self.draw(); //burada this calismadigi icin böyle yazip hemen yukarida belirtiyoruz.
            });
        }

        addObjectsToMap(objects) { //Arkaplan, bulut ve hayvanlarin eklendiyor
            objects.forEach(o => {
                this.addToMap(o);
            });
        }

        addToMap(mo) {

            if(mo.otherDirection) { //objectimiz yönünü degistirmis mi bakiyoruz. evetse
                this.flipImage(mo);
                 }
            mo.draw(this.ctx);
            mo.drawFrame(this.ctx);

            if(mo.otherDirection) { 
               this.flipImageBack(mo);
            }
        }

        flipImage(mo) {  // elementlerin hepsini tersine döndürüyoruz
            this.ctx.save();//aktüel özellikleri kaydediyoruz.
            this.ctx.translate(mo.width,0); //Burasi karakteri döndürünce ayni yerde kalip döndürüyor. Ileriye gidip dönmesini engelliyor
            this.ctx.scale(-1, 1); //y achse da döndürüyoruz. Yoksa karakter en bastan yürümeye basliyor 
            mo.x = mo.x * -1; // x kordinati döndürüyoruz. YOksa karakter dönüyor sola gitsin istiyoruz ama saga geri geri gidiyor
          
        }

        flipImageBack(mo) { //Burada da geriye dönmüs bütün elementleri eski haline getiriyoruz
             mo.x = mo.x * -1; 
                this.ctx.restore();
        }

        showGameOver() {
            document.getElementById('gameOverPanel').style.display = 'block';

            //bosluk yerin %20 ünlem yerine de %21 yazdik
            document.getElementById('gameOverImage').src = 'img/9_intro_outro_screens/game_over/oh%20no%20you%20lost%21.png';
            document.getElementById('gameOverText').textContent = 'DU HAST VERLOREN!';
    
            // Oyunu durdur
            gameState.paused = true;
        }

    }
 