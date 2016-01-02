var CropTool = (function(){
    
    function CropTool() {
        var name='crop';
        var iconSrc = 'images/icons/crop-test.png';   //source for icon file
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


        /*crop the selected region of the layer*/
        this.crop = function(){
            var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
            var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);
            var ctx = PhotoEditorUI.getInstance().getCanvas().getContext();
            var pic = layer.getPicture();

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


                //----------IMPORTANT----------------
                //The selected region in canvas is mapped to the region over image Object to retain the quality of image 
                var image = pic.getImage();
                var actualWidth = width*(image.width/dimen.width);
                var actualheight = height*(image.height/dimen.height);

                var actualStartX = (startX-pos.posX)*(image.width/dimen.width);
                var actualStartY = (startY-pos.posY)*(image.height/dimen.height);


                // a temp canvas is created to get the cropped part of image data
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                
                ctx.drawImage(pic.getImage(), actualStartX, actualStartY, actualWidth, actualheight, 
                    0,0,width, height);
                //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                
                
                var img = document.createElement("img");
                img.src = canvas.toDataURL("image/png");
                
                //update the image source of picture
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


    //this approach is used to make Class Singleton
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

//register tool in PhotoEditor tools
PhotoEditor.getInstance().addTool(CropTool.getInstance());