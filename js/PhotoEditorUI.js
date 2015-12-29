var PhotoEditorUI = (function(){
    function PhotoEditorUI(){
        var photoEditor = PhotoEditor.getInstance();
        var canvas;
        var context;
        var toolbar = ToolBarUI.getInstance();
        var layerBar = LayerBarUI.getInstance();
        var propertyBar = PropertyBarUI.getInstance();
        var filterBar = FitlerBarUI.getInstance();


        /*
            Initializes all the UI components
        */
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
        

        /*
            renders all layers sequentially w.r.t z-index
        */
        this.renderLayers = function(){
            layerBar.update();
            var layers = photoEditor.getLayers();

            //sort layers w.r.t z-index
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
                var filters = layer.getFilters();

                if(filters.length>0 || (layer.getOpacity()!=null && layer.getOpacity()<255)){
                    //draw temp image if opacity or fitlers are present
                    context.drawImage(pic.getTempImage(), pos.posX, pos.posY, dimen.width, dimen.height);
                }else{
                    //else draw original image
                    context.drawImage(pic.getImage(), pos.posX, pos.posY, dimen.width, dimen.height);
                }
            }
        }
    }


    //this approach is used to make Class Singleton
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