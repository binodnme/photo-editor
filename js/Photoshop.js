var Photoshop = (function(){
    
    function Photoshop(){
        var layers = [];
        var filters = [];
        var tools = [];


        var activeLayerIndex;   //z-index value of active layer
        var layerCounter =0;
        var zIndexValue = 0;

        var activeTool = null;
        
        
        this.addLayer = function(layer){
            layer.setZIndex(zIndexValue);
            layer.setName('layer '+layerCounter);
            layers.push(layer);
            activeLayerIndex = zIndexValue;
            zIndexValue++;
            layerCounter++;
        }

        this.getLayers = function(){
            return layers;
        }
        
        
        this.removeLayer = function(index){
            layers.splice(index,1);
            layerCounter--;
        }

        this.setActiveTool = function(string){
            activeTool = string;
            console.info('activeTool ' , activeTool);
        }

        this.getActiveTool = function(){
            return activeTool;
        }
        
        this.setActiveLayerIndex = function(index){
            activeLayerIndex = index;
        }
        
        
        this.getActiveLayerIndex = function(){
            return activeLayerIndex;
        }

        
        this.getLayerByZIndex = function(zindex){
            for (var i = layers.length - 1; i >= 0; i--) {
                if(layers[i].getZIndex()==zindex){
                    return layers[i];
                }
            };
        }


        this.addTool = function(tool){
            tools.push(tool);
        }

        this.getTools= function(){
            return tools;
        }

        this.addFilter = function(filter){
            filters.push(filter);
        }

        this.getFilters = function(){
            return filters;
        }
    }

    var instance;

    return {
        getInstance: function(){
            if(instance==null){
                instance = new Photoshop();
                instance.constructor = null;
            }

            return instance;
        }
    };

}());