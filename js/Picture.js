function Picture(){
    var img = new Image();
    // var copyImg = new Image();
    // var pixels;
    var width;
    var height;
    var posX=0;
    var posY=0;
    var zIndex;
    var opacity;


    this.setImage = function(image){
        img = image;
        width = img.width;
        height = img.height;
    }

    this.getImage = function(){
        return img;
        // return copyImg;
    }

    this.setImageSrc = function(src){
        img.src = src;
        width = img.width;
        height = img.height;
        console.info('width:', width, ' height:', height);
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
            // var mainFilter = new Filter();
            // pixels = mainFilter.getPixels(this);
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


    this.getOpacity = function(){
        return opacity;
    }

    this.setOpacity = function(opValue){
        opacity = opValue;
        console.info('opacity opacity');

        // console.info('picture: ', this);

        // console.info('r:',pixels.data[0],'g:',pixels.data[1],'b:',pixels.data[2],'a:',pixels.data[3]);

        // for (var i = pixels.data.length - 1; i >= 0; i-=4) {
        //  pixels.data[i]=opValue;
        // };
        
        // console.info('r:',pixels.data[0],'g:',pixels.data[1],'b:',pixels.data[2],'a:',pixels.data[3]);
        
        // var cnvs = document.createElement('canvas');
        
        // cnvs.width = pixels.width;
        // cnvs.height = pixels.height;

        // var ctx = cnvs.getContext('2d');
        // // ctx.clearRect(0,0,cnvs.width, cnvs.height);
        // ctx.putImageData(pixels, 0,0);
        
        // img.src = cnvs.toDataURL('image/png');
    }

    this.draw = function(ctx,x,y){
        // console.log('img',img,' x:',posX,' y',posY,' width:',width,' height',height, 'zoomlevel:',zoomlevel);
        if(x && y){
            posX = x;
            posY = y;
        }

        ctx.drawImage(img, posX, posY, width, height);
        
    }
}
