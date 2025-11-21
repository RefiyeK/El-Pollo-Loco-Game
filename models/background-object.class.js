class BackgroundObject extends MovableObject{

        width = 720;
        height = 480;
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x; //canva genisligi
        this.y = 480 - this.height; //canva yüksekligi 480 - resim 400 
        
    }
}