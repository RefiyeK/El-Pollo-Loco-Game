class Cloud extends MovableObject { //MovableObject dosyanindaki özellikleri tasiyor.
    y = 20; //Bulutlarin yeri
    width = 500; //Bulut genisligi
    height = 250; //Bulut yüksekligi
    

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png'); //Bulut resminin yüklendigi yer
        this.x = Math.random() * 7000; //x pozisyon 0-500 arasinda. Bu sayede bulutlarin hepsi ayni konumda olmamis oluyor.
        this.speed = 0.2; //bulutlar yavas hareket ediyor
        this.animate(); //animasyonu calismasi icin fonsiyon cagiriyoruz. Bu bizim fonksiyon adimiz.
    }

    animate() { //Bulutlarin hareketini  belirtiyoruz
        setInterval(() => {
        this.moveLeft(); //Bulutlar sola hareket etmeli
        }, 1000 / 60); //Bulutlar dakikada 60 saniye hareket diyor
    }

}