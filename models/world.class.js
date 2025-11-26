class World {
    character = new Character();
    level = level1; 
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Burada arka planin ilerledikce kaymasini söylüyoruz
    statusBar = new StatusBar();
    coinStatusBar = new CoinStatusBar(230, 0); //tam yerini gösteriyor
    bossStatusBar = new BossStatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.statusBar = new StatusBar(); //Karakter can göstergesi
        this.coinStatusBar = new CoinStatusBar(230, 0); //Coin göstergesi
        this.bossStatusBar = new BossStatusBar(); //Boss can göstergesi
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {
        
        this.character.world = this;
           this.level.enemies.forEach((enemy) => {//oyundaki tüm düsmanlar.her birini tek tek kontrol et.
            if(enemy instanceof Endboss) {//Bu bir endboss mu kontrol et.evetse iceri gir hayirsa atla
                enemy.world = this;//Endbossun world özelligine word sinifini ata
            }
        });
    }

    run() {//Bu metot, her 200 milisaniyede bir çalışan (yani yavaş bir) mantık döngüsüdür. 
    // Çarpışmaları, şişe fırlatmayı ve kazanma/kaybetme durumlarını kontrol eder. Bu metot, ekrana hiçbir şey çizmez.
        setInterval(() => {
        if(!gameState.paused) { //oyuna ara verilmemisse carpismayi kontrol et
             this.checkCollisions();
             this.checkThrowObjects();
             this.checkBottleCollision();
        }

         if(gameState.gameOver) {
            this.showGameOver();
         }

            //Endboss öldü mü kontrol et. Öldüyse  (some ile ölüp ölmedigini kontrol ediyoruz)
         if(this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.isDead)) {
            gameState.won = true; //oyun kazanildi
            this.showGameOver();//bu fonksiyonu cagir
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

            //TAVUK-CIVCIV ZIPLAMA (Jump Attack)
        this.level.enemies.forEach( (enemy) => {

            if(enemy instanceof Endboss) { //Büyük tavuk a ziplama uygulanmasin
                return; // Endboss'u atla, devam etme
            }
            if(enemy.isDead) { //Eger düsman öldüyse kontrol etme
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

        this.level.coins.forEach((coin) => {
            if(this.character.isColliding(coin)) {
                this.character.collectCoin(); //Altin sayisini artir
                this.coinStatusBar.setPercentage(this.character.coins); //Göstergeyi güncelle
                let index = this.level.coins.indexOf(coin);
                if(index > -1) {
                    this.level.coins.splice(index, 1); //Altini arraydan sil
                }
            }
        });
    });
            
        
        this.level.enemies.forEach( (enemy) => {

            //Karakter tavugun/civcivin üzerine zipladi mi?
            if(this.character.isColliding(enemy) ) { 
                this.character.hit(); //hit te karakterin kaybettigi can orani belirli
                this.statusBar.setPercentage(this.character.energy);
                
            if(this.character.isDead()) { //karakter öldügünde
                gameState.gameOver = true; //Oyun bitti veriyoruz
                }        
            }
        });
    }



    draw() { //
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //canvasi temizle
        
        this.ctx.translate(this.camera_x, 0); //Kamerayi karakter ile birlikte hareket ettir
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.coins); 
        this.addObjectsToMap(this.level.bottles);  
        this.ctx.translate(-this.camera_x, 0);//Kamera kaydirma islemini geri al(kaydirma) status barlar sabit kalsin
        
        this.addToMap(this.statusBar); //Karakter can göstergesi
        this.addToMap(this.coinStatusBar);//coin göstergesi
        this.addToMap(this.bossStatusBar);//Bos can göstergesi
       
            
        let self = this; //Draw() wird immer wieder aufgerufen (fonksiyonu tekrar cagirir)
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
            //GAME OVER panelini göster
            document.getElementById('gameOverPanel').style.display = 'block';//classList.add('show')

            //Kaybettin mi yoksa kazandin mi kontrol et
            if(gameState.gameOver && this.character.isDead()) {
                            //KAYBETTI
                //bosluk yerine %20, ünlem yerine de %21, virgül yerine %2 yazdik
                document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20lost%20b.png';
                document.getElementById('gameOverText').textContent = 'DU HAST VERLOREN!';
            
            } else if(gameState.won) {
                //KAZANDI
                document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
                document.getElementById('gameOverText').textContent = 'DU HAST GEWONNEN!';
            }

            // Oyunu durdur
            gameState.paused = true;
        }


            //Büyük tavukla sise carpismasi
        checkBottleCollision() {
            this.throwableObjects.forEach((bottle) => { //Tüm firlatilan siseleri kontrol et
               
            let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);//düsmanlar arasindan endboss u bul
                if(endboss && bottle.isColliding(endboss)) { //Eger endboss varsa ve sise endboss`a carptiysa   
                bottle.splash(); // Şişeyi kir
                endboss.takeDamage(20); //Endbossà 20 hasar ver
                this.bossStatusBar.setPercentage(endboss.health); //Boss can cubugunu güncelle
            
            let index = this.throwableObjects.indexOf(bottle); //Siseyi array`dan cikart(artik yok olsun)
            if(index > -1) {
                this.throwableObjects.splice(index, 1);
                }
            }
        });
    }

        
     
}
