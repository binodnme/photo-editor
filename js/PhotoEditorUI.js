var PhotoEditorUI = (function(){
    function PhotoEditorUI(){
        var photoEditor = PhotoEditor.getInstance();
        var canvas;
        var context;
        var toolbar = ToolBarUI.getInstance();
        var layerBar = LayerBarUI.getInstance();
        var propertyBar = PropertyBarUI.getInstance();


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
            // toolbar.update();
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
                pic.draw(context);
                
                var filter = layer.getFilters();

                var mainFilter = new Filter();

                var pixels = mainFilter.getPixels(pic);
                if(layer.getFilters().length){
                    for (var i = layer.getFilters().length - 1; i >= 0; i--) {
                        var filter = layer.getFilters()[i];
                        if(filter.isActive()){
                            pixels = filter.filterImage(filter.filter, pixels, filter.getArgs());

                            var pos = pic.getPosition();
                            context.putImageData(pixels, pos.posX, pos.posY); 
                        }
                    };

                }
            }

            var tempLayer = photoEditor.getActiveLayer();
            if(tempLayer){
                var dimen = tempLayer.getPicture().getDimension();
                var position = tempLayer.getPicture().getPosition();

                drawOutline(position, dimen);
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