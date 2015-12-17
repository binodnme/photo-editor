var PhotoshopUI = (function(){
    function PhotoshopUI(){
        var photoshop = Photoshop.getInstance();
        var canvas;
        var context;
        var toolbar = ToolBarUI.getInstance();
        var layerBar = LayerBarUI.getInstance();
        var propertyBar;


        this.init = function(){
            canvas = new Canvas();
            canvas.init();
            context = canvas.getContext('2d');

            var ul = document.getElementById('layer-list');
            var tb = document.getElementById('toolbar');
            layerBar.setParent(ul);
            toolbar.setParent(tb);

            toolbar.init();
            layerBar.init();
        }

        
        this.setCanvas = function(c){ 
            canvas = c;
            context = canvas.getContext('2d');
        }
        
        this.getCanvas = function(){ return canvas; }
        

        this.renderLayers = function(){
            // toolbar.update();
            layerBar.update();
            var layers = photoshop.getLayers();

            layers.sort(function(a,b){
                return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
            });
            
            context.clearRect(0,0,canvas.width,canvas.height);

            for(var i in layers){
                var layer = layers[i];
                var pic = layer.getPicture();
                pic.draw(context);
                // var filter = layer.getFilters();

                // var mainFilter = new Filter();

                // var pixels = mainFilter.getPixels(pic);
                // if(layer.getFilters().length){
                //     for (var i = layer.getFilters().length - 1; i >= 0; i--) {
                //         var filter = layer.getFilters()[i];
                //         // console.log('arguments: ', filter.getArgs());
                //         // var pixels = filter.filterImage(filter.filter, pic, filter.getArgs());
                //         pixels = filter.filterImage(filter.filter, pixels, filter.getArgs());

                //         var pos = pic.getPosition();
                //         ctx.putImageData(pixels, pos.posX, pos.posY);
                //     };

                // }
            }
        }
    }



    var instance; 
    return {
        getInstance: function(){
            if(instance == null){
                instance = new PhotoshopUI();
                instance.constructor = null;
            }

            return instance;
        }
    }
}());