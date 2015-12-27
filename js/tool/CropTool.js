
var CropTool = (function(){
    var iconSrc = 'images/icons/crop.png';   //source for icon file

    function CropTool() {
        var name='crop';
        var startX;
        var startY;
        var endX;
        var endY;
        
        this.getName = function(){
            return name;
        }

        this.getIconSrc = function(){
            return iconSrc;
        }

        this.setParameters = function(x,y,x1,y1){
            startX = x;
            startY = y;
            endX = x1;
            endY = y1;
        }

        this.crop = function(){
            var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
            var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);
            var ctx = PhotoEditorUI.getInstance().getCanvas().getContext();
            var pic = layer.getPicture();

            // console.log('startX', startX, ' startY', startY);

            if(startX){
                console.info('wait while cropping :D');

                if(startX>endX){
                    var temp = startX;
                    startX = endX;
                    endX = temp;
                }

                if(startY>endY){
                    var temp = startY;
                    startY = endY;
                    endY = temp;
                }

                var pos = pic.getPosition();
                var dimen = pic.getDimension();
                
                if(startX > (pos.posX + dimen.width) || endX<pos.posX || startY>(pos.poY+dimen.height) || endY<pos.posY){
                    return null;
                }


                if(startX<pos.posX){
                    startX = pos.posX;
                }

                if(endX> (pos.posX+dimen.width)){
                    endX = pos.posX+dimen.width;
                }

                if(startY<pos.posY){
                    startY = pos.posY;
                }

                if(endY>(pos.posY+dimen.height)){
                    endY = pos.posY+dimen.height;
                }

                var width = endX -startX;
                var height = endY -startY;

                PhotoEditorUI.getInstance().renderLayers();


                var image = pic.getImage();
                var actualWidth = width*(image.width/dimen.width);
                var actualheight = height*(image.height/dimen.height);

                var actualStartX = (startX-pos.posX)*(image.width/dimen.width);
                var actualStartY = (startY-pos.posY)*(image.height/dimen.height);


                // var imageData = ctx.getImageData(startX, startY, width, height);

                var canvas = document.createElement("canvas");
                // var canvas = document.getElementById('testground');
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext("2d");
                

                // ctx.drawImage(pic.getImage(), startX-pos.posX, startY-pos.posY, width, height, 
                //     0,0,width, height);
                 ctx.drawImage(pic.getImage(), actualStartX, actualStartY, actualWidth, actualheight, 
                    0,0,width, height);
                //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                // ctx.putImageData(imageData,0,0);
                // ctx.draw()

                var img = document.createElement("img");
                img.src = canvas.toDataURL("image/png");
                // img.crossOrigin = "anonymous";

                // pic.setImageSrc(img.src);
                layer.setPictureSrc(img.src);

                pic.setPosition(startX, startY);

                PhotoEditorUI.getInstance().renderLayers();
            }
        }

        this.reset = function(){
            startX = startY = endX = endY = null;
            console.info('reset crop tool');
        }
    	    
    }


    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new CropTool();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
})();


PhotoEditor.getInstance().addTool(CropTool.getInstance());