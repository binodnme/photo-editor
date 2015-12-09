function Canvas(){
    var canvas;
    var context;
    var width;
    var height;
    var layers = [];
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
        layers.push(layer);
        zIndexValue++;
        layerCounter++;
        console.log('total layers: ',layerCounter);
    }
    
    this.removeLayer = function(index){
        layers.splice(index,1);
        layerCounter--;
        console.log('total layers: ',layerCounter);
    }
    
    this.getLayers = function(){
        return layers;
    }
    
    this.renderLayers = function(zoomlevel){
        console.log('rendering');
        layers.sort(function(a,b){
            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
        });
        
        if(zoomlevel){
            for(var layer in layers){
                layers[layer].getPicture().draw(context, zoomlevel);
            }
        }else{
            for(var layer in layers){
                layers[layer].getPicture().draw(context);
            }
        }
        
        
    }
}