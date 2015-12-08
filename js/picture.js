function Picture(){
    var img = new Image();
    var width;
    var height;
    var posX=0;
    var posY=0;
    
    
    this.setImage = function(image){
        img = image;
    }
    
    this.getImage = function(){
        return img;
    }
    
    this.setImageSrc = function(src){
        img.src = src;
    }
    
    this.getImageSrc = function(){
        return img.src;
    }
    
    this.setDimension = function(w, h){
        width = w;
        height = h;
    }
    
    this.getDimension = function(){
        return {'width':width, 'height':height};
    }
    
    this.setPosition = function(x, y){
        posX = x;
        posY = y;
    }
    
    this.getPosition = function(){
        return {'posX':posX, 'posY':posY};
    }
    
    this.draw = function(ctx){
        console.log('img',img,' x:',posX,' y',posY,' widht:',width,' height',height);
        ctx.drawImage(img, posX, posY, width, height);
    }
}