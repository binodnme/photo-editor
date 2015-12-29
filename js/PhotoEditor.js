var PhotoEditor = (function(){
    
    function PhotoEditor(){
        var layers = [];
        var filters = [];
        var tools = [];

        var activeLayerIndex;   //z-index value of active layer
        var layerCounter =0;
        var zIndexValue = 0;
        var activeTool = 'select';
        
       
        /*
            *adds new layer to the layers array and updates the indices and counters
            @params {Layer} layer
        */
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
        
        
        /*
            *remove layer from layers array
            @params {Number} index
        */        
        this.removeLayer = function(index){
            layers.splice(index,1);
            layerCounter--;
        }


        /*
            *sets the active tool
            @params {String} string
        */
        this.setActiveTool = function(string){
            activeTool = string;
        }

        this.getActiveTool = function(){
            return activeTool;
        }
        

        /*
            *sets activeLayerIndex 
            @params {Number} index
            *the input param 'index' is the z-Index value of layer
        */
        this.setActiveLayerIndex = function(index){
            activeLayerIndex = index;
        }
        
        
        this.getActiveLayerIndex = function(){
            return activeLayerIndex;
        }

        this.getActiveLayer = function(){
            return this.getLayerByZIndex(activeLayerIndex);
        }

        
        /*
            *returns layer with given z-index
            @params {Number} zindex
            @return {Layer} layer
        */
        this.getLayerByZIndex = function(zindex){
            for (var i = layers.length - 1; i >= 0; i--) {
                if(layers[i].getZIndex()==zindex){
                    return layers[i];
                }
            };
        }


        /*
            *adds tool to the tools array
            @params {ToolObject} tool
        */
        this.addTool = function(tool){
            tools.push(tool);
        }


        this.getTools= function(){
            return tools;
        }


        // this.addFilter = function(filter){
        //     filters.push(filter);
        // }


        // this.getFilters = function(){
        //     return filters;
        // }
    }


    //this approach is used to make Class Singleton
    var instance;
    return {
        getInstance: function(){
            if(instance==null){
                instance = new PhotoEditor();
                instance.constructor = null;
            }

            return instance;
        }
    };

}());