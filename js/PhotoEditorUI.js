var PhotoEditorUI = (function(){
    function PhotoEditorUI(){
        var photoEditor = PhotoEditor.getInstance();
        var canvas;
        var context;
        var toolbar = ToolBarUI.getInstance();
        var layerBar = LayerBarUI.getInstance();
        var propertyBar = PropertyBarUI.getInstance();
        var filterBar = FitlerBarUI.getInstance();


        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');
        var tempImg = new Image();


        this.init = function(){
            canvas = new Canvas();
            canvas.init();
            context = canvas.getContext('2d');

            var ul = document.getElementById('layer-list');
            var tb = document.getElementById('toolbar');
            var pl = document.getElementById('property-list');

            layerBar.setParent(ul);
            toolbar.setParent(tb);
            propertyBar.setParent(pl);

            toolbar.init();
            layerBar.init();
            propertyBar.init();
            filterBar.init();
        }

        
        this.setCanvas = function(c){ 
            canvas = c;
            context = canvas.getContext('2d');
        }
        
        this.getCanvas = function(){ return canvas; }


        this.getLayerBarUI = function(){
            return layerBar;
        }

        this.getToolBarUI = function(){
            return toolbar;
        }
        

        this.renderLayers = function(){
            layerBar.update();
            var layers = photoEditor.getLayers();

            layers.sort(function(a,b){
                return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
            });
            
            var dimen = canvas.getDimension();
            context.clearRect(0,0,dimen.width,dimen.height);

            for(var i in layers){
                var layer = layers[i];
                var pic = layer.getPicture();
                var pos = pic.getPosition();
                var dimen = pic.getDimension();
                // var image = pic.getImage();

                var filter = layer.getFilters();
                var mainFilter = new Filter();
                var pixels = mainFilter.getPixels(pic);

                var opacity = pic.getOpacity();
                if(opacity!=null && opacity<255){
                    for (var i = pixels.data.length - 1; i >= 0; i-=4) {
                        pixels.data[i]=opacity;      
                    };
                }
                
                
                if(layer.getFilters().length){
                    for (var i = layer.getFilters().length - 1; i >= 0; i--) {
                        var filter = layer.getFilters()[i];
                        if(filter.isActive()){
                            pixels = filter.filterImage(filter.filter, pixels, filter.getArgs());
                        }
                    };
                }

                // var tempCanvas = document.createElement('canvas');
                console.info('dimen: ', dimen);
                console.info('pixels: ', pixels);
                tempCanvas.width = pixels.width;
                tempCanvas.height = pixels.height;
                // var tempCtx = tempCanvas.getContext('2d');

                tempCtx.putImageData(pixels,0,0);

                // var tempImg = new Image();
                tempImg.src = tempCanvas.toDataURL('image/png');
                context.drawImage(tempImg, pos.posX, pos.posY, dimen.width, dimen.height);
                
                
                // console.info('rendering finished');
            

                // context.putImageData(pixels, pos.posX, pos.posY);
            }
        }
    }


    var instance; 
    return {
        getInstance: function(){
            if(instance == null){
                instance = new PhotoEditorUI();
                instance.constructor = null;
            }
            return instance;
        }
    }
}());