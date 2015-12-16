function Canvas(){
    var canvas;
    var context;
    var width;
    var height;
    var layers = [];
    var activeLayerIndex;   //z-index value of active layer
    var layerCounter =0;
    var zIndexValue = 0;
    
    
    this.setCanvas = function(c){ 
        canvas = c;
        context = canvas.getContext('2d');
    }
    
    this.getCanvas = function(){ return canvas; }
    

    this.getContext = function(){
        if(context){
            return context;
        }
        return undefined;
    }
    

    this.setDimension = function(w, h){
        width = w;
        height = h;
    }
    

    this.getDimension = function(){
        return {'width':width, 'height':height};
    }
    

    this.addLayer = function(layer){
        layer.setZIndex(zIndexValue);
        layer.setName('layer '+layerCounter);
        layers.push(layer);
        activeLayerIndex = zIndexValue;
        zIndexValue++;
        layerCounter++;
    }
    
    
    this.removeLayer = function(index){
        layers.splice(index,1);
        layerCounter--;
    }

    
    this.setActiveLayerIndex = function(index){
        activeLayerIndex = index;
    }
    
    
    this.getActiveLayerIndex = function(){
        return activeLayerIndex;
    }

    
    this.getLayers = function(){
        return layers;
    }
    
    this.getLayerByZIndex = function(zindex){
        for (var i = layers.length - 1; i >= 0; i--) {
            if(layers[i].getZIndex()==zindex){
                return layers[i];
            }
        };
    }
    
    this.renderLayers = function(zoomlevel){
        // console.log('rendering');

        layers.sort(function(a,b){
            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
        });
        
        ctx.clearRect(0,0,canvas.width,canvas.height);
        
        if(zoomlevel){
            for(var layer in layers){
                layers[layer].getPicture().draw(context, zoomlevel);
            }
        }else{
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
                        // console.log('arguments: ', filter.getArgs());
                        // var pixels = filter.filterImage(filter.filter, pic, filter.getArgs());
                        pixels = filter.filterImage(filter.filter, pixels, filter.getArgs());

                        var pos = pic.getPosition();
                        ctx.putImageData(pixels, pos.posX, pos.posY);
                    };

                }
            }
        }
       
    }

    
    this.hasZIndex = function(index){
        for (var i = layers.length - 1; i >= 0; i--) {
            if(layers[i].getZIndex()==index){
                return true;
            }
        }

        return false;
    }
}