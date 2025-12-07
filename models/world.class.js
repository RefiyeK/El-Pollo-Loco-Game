class World {
    character;
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Burada arka planin ilerledikce kaymasini söylüyoruz
    statusBar;
    coinStatusBar;
    bossStatusBar;
    // statusBar = new StatusBar();
    // coinStatusBar = new CoinStatusBar(230, 0); //tam yerini gösteriyor
    // bossStatusBar = new BossStatusBar();
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = createLevel1();
        this.character = new Character();
        this.statusBar = new StatusBar(); //Karakter can göstergesi
        this.coinStatusBar = new CoinStatusBar(); //Coin göstergesi
        this.bossStatusBar = new BossStatusBar(); //Boss can göstergesi
        this.bottleStatusBar = new BottleStatusBar();
        this.camera_target = 0; //Kameranin gitmek istedigi yer
        this.smoothCamera = 0; //Yumusatilmis kamera degeri
        this.setWorld();
        this.draw();
        this.run();
    }

    setWorld() {        
        this.character.world = this;
           this.level.enemies.forEach((enemy) => {//oyundaki tüm düsmanlar.her birini tek tek kontrol et.
            if(enemy instanceof Endboss) {//Bu bir endboss mu kontrol et.evetse iceri gir hayirsa atla
                enemy.world = this;//Endbossun world özelligine word sinifini ata
                enemy.animate(); //World bağlandıktan SONRA animate başlasın
            }
        });
    }

    run() {
        const collisionInterval = setInterval(() => {
        if(!isGameActive()) return; // 

        this.checkCollisions();
        this.checkThrowObjects();
        this.removeFinishedBottles();

        if(gameState.gameOver) {
            this.showGameOver();
        }

        if(this.level.enemies.some(enemy => enemy instanceof Endboss && enemy.isDead)) {
            gameState.won = true;
            this.showGameOver();
        }
    }, 200);

    const bottleInterval = setInterval(() => {
        if(!isGameActive()) return; //
        this.checkBottleCollision();
    }, 1000 / 60);
    
    intervalIds.push(collisionInterval);
    intervalIds.push(bottleInterval);
}

    checkThrowObjects() {
        //D tusuna basildi mi ve elimizde sise var mi kontrol et
        if(this.keyboard.D && this.character.bottles > 0) {
            //Karakterin hangi yöne baktigini kontrol et
            let direction = this.character.otherDirection ? -1 : 1; //Sola bakiyorsa -1, saga bakiyorsa 1

            let bottleX; //SIsenin baslangic pozisyonunu yöne göre ayarla
            if(this.character.otherDirection) { //Karakter sola bakiyorsa , siseyi sag tarafa koy
                bottleX= this.character.x - 50; // Karakterin solundan baslat
            }else { //Karakter saga bakiyorsa, siseyi sag tarafa koy
                bottleX = this.character.x + 100; //Karakterin sagindan baslat
            }

            //Yeni bir sise olustur ve yön bilgisini de gönder (Yöne göre ayarlanmis X pozisyonu)
            let bottle = new ThrowableObject(bottleX, this.character.y +100, direction);//
            //Siseleri saklayan array`a ekle
            this.throwableObjects.push(bottle);

            this.character.bottles -= 1; //Karakterin sise sayisini bir azalt
            //Ekrandaki sise göstergesini güncelle (görseli degistir)
            this.bottleStatusBar.setBottles(this.character.bottles);
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

            //TAVUK SESI YÜKLEME
            if(enemy instanceof Chicken) {
                AudioHub.chicken_sound.currentTime = 0; //Basa sar
                AudioHub.chicken_sound.volume = 0.2; //Ses seviyesi 20%
                AudioHub.chicken_sound.play(); //Cal
            }

            //CIVCIV SESI YÜKLEME
            if(enemy instanceof ChickenBaby) {
                AudioHub.chicken_baby_sound.currentTime = 0; //Basa sar
                AudioHub.chicken_baby_sound.volume = 0.2; //Ses seviyesi 20%
                AudioHub.chicken_baby_sound.play(); //Cal
            }

            
            let index = this.level.enemies.indexOf(enemy); //düsmani arrayda ara bul
            if(index > -1) {
                this.level.enemies.splice(index,1); //arrayden cikart
            }
                //karakteri biraz yukari atla. Ziplamis gibi görünsün
                this.character.speedY = 15;
            }


        this.level.coins.forEach((coin) => {
            if(this.character.isColliding(coin)) {
        
            //Coin 350 den yüksekte mi kontrol et
        let coinIsHigh = coin.y < 350; // Coin 300'den yukarıda mı?
        let characterIsJumping = this.character.isAboveGround(); // Karakter havada mı?
        
        // Eğer coin yüksekte ama karakter zıplamıyorsa, TOPLAMA!
        if(coinIsHigh && !characterIsJumping) {
            return; // Fonksiyondan çık, coin toplanmasın
            }
        
        // Her şey tamamsa, coin'i topla
        this.character.collectCoin();
        this.coinStatusBar.setPercentage(this.character.coins);

        //Coin sesi yükleme
        AudioHub.coin_sound.currentTime = 0; //Basa sar
        AudioHub.coin_sound.volume = 0.2; //ses seviyesi %20
        AudioHub.coin_sound.play().catch((e) => {
            console.warn("Coin-Sound konnte nicht abgespielt werden:", e);
        });

        let index = this.level.coins.indexOf(coin);
        if(index > -1) {
            this.level.coins.splice(index, 1);
                }
            }
        });
    });
            

        //SISE TOPLAMA ÖZELLIGI
    for(let i = this.level.bottles.length - 1; i >= 0; i--) {
        let bottle = this.level.bottles[i];
    
        //isCollected kontrolü ekle
        if(this.character.isColliding(bottle) && 
            this.character.bottles < 10 && 
            !bottle.isCollected) { //Bu şişe daha önce toplanmadıysa
            bottle.isCollected = true; // İşaretle
        
        // Şişeyi topla
        this.character.collectBottle();
        this.bottleStatusBar.setBottles(this.character.bottles);
        // Array'den çıkar
        this.level.bottles.splice(i, 1);
        }
    }
        

           //DÜSMAN CARPISMA ALANI
        this.level.enemies.forEach( (enemy) => {
            //Karakter tavugun/civcivin üzerine zipladi mi?
            if(this.character.isColliding(enemy) ) { 
                this.character.hit(); //hit te karakterin kaybettigi can orani belirli
                this.statusBar.setPercentage(this.character.energy);

                //Karakter cankaybi sesi
                AudioHub.hurt_sound.currentTime = 0;
                AudioHub.hurt_sound.volume = 0.3;
                AudioHub.hurt_sound.play().catch((e) => {
                    console.warn("Schaden-Sound konnte nicht abgespielt werden:", e);
                });
                
            if(this.character.isDead()) { //karakter öldügünde
                gameState.gameOver = true; //Oyun bitti veriyoruz
                }        
            }
        });
}


draw() {
    //Pause veya Game Over ise ÇİZME ama requestAnimationFrame'i çağır
    if(gameState && (gameState.paused || gameState.gameOver)) {
        // Hiçbir şey çizme, son kare ekranda kalsın
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
        return; //Burada çık
    }
    
    //Normal çizim (oyun devam ediyorsa)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if(this.character.otherDirection) {
        this.camera_x = Math.round(-this.character.x + 550);
    } else {
        this.camera_x = Math.round(-this.character.x + 100);
    }
    
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins); 
    this.addObjectsToMap(this.level.bottles);  
    this.ctx.translate(-this.camera_x, 0);
    
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bossStatusBar);
    this.addToMap(this.bottleStatusBar);
    
    let self = this;
    requestAnimationFrame(function() {
        self.draw();
    });
}

addObjectsToMap(objects) { //Arkaplan, bulut ve hayvanlarin ekleniyor
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

        //KAYBETME SESI CAL
        stopBackgroundMusic();
        AudioHub.lost_sound.currentTime = 0; //Basa sar
        AudioHub.lost_sound.volume = 0.4; //Ses seviyesi %40
        AudioHub.lost_sound.play().catch((e) => {
            console.warn("Verloren-Sound konnte nicht abgespielt werden:", e)
        })
            
    } else if(gameState.won) {
        //KAZANDI
        document.getElementById('gameOverImage').src = 'img/You%20won%2C%20you%20lost/You%20Win%20A.png';
        document.getElementById('gameOverText').textContent = 'DU HAST GEWONNEN!';

        //KAZANMA SESI CAL
        stopBackgroundMusic();
        AudioHub.win_sound.currentTime = 0; //Basa sar
        AudioHub.win_sound.volume = 0.4; //Ses seviyesi %40
        AudioHub.win_sound.play().catch((e) => {
            console.warn("Gewinn-Sound konnte nicht abgespielt werden:", e);
        });
    }

    // Oyunu durdur
            gameState.paused = true;
}

        

checkBottleCollision() { //SISE FIRLATMA FONKSIYONU
    this.throwableObjects.forEach((bottle) => { // Tüm fırlatılan şişeleri kontrol et
        
    // TÜM DÜŞMANLARI kontrol et (tavuk, civciv, endboss)
    this.level.enemies.forEach((enemy) => {
            
        // Şişe düşmana çarptı mı?
        if(bottle.isColliding(enemy) && !bottle.isSplashed) {
            bottle.splash(); // Şişeyi kır
                
            // Eğer düşman ENDBOSS ise
            if(enemy instanceof Endboss) {

                enemy.takeDamage(20); // Endboss'a 20 hasar ver
                this.bossStatusBar.setPercentage(enemy.health); // Boss can çubuğunu güncelle
            } 
            // Eğer düşman TAVUK veya CİVCİV ise
            else {
                enemy.isDead = true; // Düşmanı öldür
                
                        //TAVUK SESI YÜKLEME
                    if(enemy instanceof Chicken) {
                        AudioHub.chicken_sound.currentTime = 0; //Basa sar
                        AudioHub.chicken_sound.volume = 0.2; //Ses seviyesi 20%
                        AudioHub.chicken_sound.play(); //Cal
                    }

                            //CIVCIV SESI YÜKLEME
                        if(enemy instanceof ChickenBaby) {
                            AudioHub.chicken_baby_sound.currentTime = 0; //Basa sar
                            AudioHub.chicken_baby_sound.volume = 0.2; //Ses seviyesi 20%
                            AudioHub.chicken_baby_sound.play(); //Cal
                        }

                    setTimeout(() => {
                    // Düşmanı array'dan çıkart
                    let enemyIndex = this.level.enemies.indexOf(enemy);
                    if(enemyIndex > -1) {
                        this.level.enemies.splice(enemyIndex, 1);
                    }
                }, 500);
            }
                
                setTimeout(() => {
                    let bottleIndex = this.throwableObjects.indexOf(bottle);
                    if(bottleIndex > -1) {
                        this.throwableObjects.splice(bottleIndex, 1);
                    }
                }, 600); // 600ms bekle
            }
        });
    });
}


removeFinishedBottles() {
    // Silinebilir olmayan şişeleri tut, silinebilir olanları çıkar
    this.throwableObjects = this.throwableObjects.filter(bottle => {
        return !bottle.canBeRemoved;
        });
    }
}   
