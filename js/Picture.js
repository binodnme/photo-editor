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
    
    this.setWidth = function(w){
        if(w>0) width = w;
    }

    this.getWidth = function(){
        return width;
    }

    this.setHeight = function(h){
        if(h>0) height = h;
    }

    this.getHeight = function(){
        return height;
    }

    this.setDimension = function(w, h){
        if(w>0 && h>0){
            width = w;
            height = h;    
        }
        
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
    
    this.draw = function(ctx, zoomlevel, x, y){
        // console.log('img',img,' x:',posX,' y',posY,' width:',width,' height',height, 'zoomlevel:',zoomlevel);
        if(x && y){
            posX = x;
            posY = y;    
        }
        
        if(zoomlevel){
            ctx.drawImage(img, posX, posY, width*zoomlevel, height*zoomlevel);
        }else{
            ctx.drawImage(img, posX, posY, width, height);
        }
        
    }
}