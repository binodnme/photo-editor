function Picture(){
    var img = new Image();
    var width;
    var height;
    var posX=0;
    var posY=0;
    var zIndex;
    
    
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
    
    this.setZIndex = function(index){ zIndex = index; }
    
    this.getZIndex = function(){ return zIndex; }
    
    this.draw = function(ctx, x, y){
//        console.log('img',img,' x:',posX,' y',posY,' widht:',width,' height',height);
        if(x && y){
            posX = x;
            posY = y;    
        }
        ctx.drawImage(img, posX, posY, width, height);
    }
}