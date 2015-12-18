
var CropTool = (function(){
    var iconSrc = '';   //source for icon file

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

                var imageData = ctx.getImageData(startX, startY, width, height);

                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext("2d");
                ctx.putImageData(imageData,0,0);

                var img = document.createElement("img");
                img.src = canvas.toDataURL("image/png");

                pic.setImageSrc(img.src);

                pic.setPosition(startX, startY);

                PhotoEditorUI.getInstance().renderLayers();

                startX = startY = endX = endY = null;
            }
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