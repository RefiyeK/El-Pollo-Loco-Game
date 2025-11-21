class World {
    character = new Character();
    level = level1;  
    canvas;
    ctx;
    keyboard;
    camera_x = 0; //Burada arka planin ilerledikce kaymasini söylüyoruz

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();

    }


    setWorld() {
        this.character.world = this;
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0); //kamerayi sola dogru kaydiriyor

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);

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

            //ilk If alaninda elementlerin hepsini tersine döndürüyoruz
            if(mo.otherDirection) { //objectimiz yönünü degistirmis mi bakiyoruz. evetse
                this.ctx.save();//aktüel özellikleri kaydediyoruz.
                this.ctx.translate(mo.width,0); //Burasi karakteri döndürünce ayni yerde kalip döndürüyor. Ileriye gidip dönmesini engelliyor
                this.ctx.scale(-1, 1); //y achse da döndürüyoruz. Yoksa karakter en bastan yürümeye basliyor 
                mo.x = mo.x * -1; // x kordinati döndürüyoruz. YOksa karakter dönüyor sola gitsin istiyoruz ama saga geri geri gidiyor
            }
            
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height); //döndürülmüs ekliyor resmi
            
            if(mo.otherDirection) { //Burada da geriye dönmüs bütün elementleri eski haline getiriyoruz
                mo.x = mo.x * -1; 
                this.ctx.restore();
            }
        }
    }