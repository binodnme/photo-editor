function Picture(){
    var img = new Image();
    var tempImg = new Image();          //this image holds all the changes in img object
    var width;
    var height;
    var posX=0;
    var posY=0;
    

    this.setImage = function(image){
        img = image;
        width = img.width;
        height = img.height;
    }

    
    this.getImage = function(){
        return img;
    }

    
    this.setImageSrc = function(src){
        img.src = src;
        width = img.width;
        height = img.height;
    }

    
    this.getImageSrc = function(){
        return img.src;
    }

    
    this.getTempImage = function(){
        return tempImg;
    }

    
    this.setTempImage = function(tempImage){
        tempImg = tempImage;
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
}
