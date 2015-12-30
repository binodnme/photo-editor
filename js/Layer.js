function Layer(){
    var name;
    var zIndex;         //z-index value of layer, which determines the rendering priority
    var picture;
    var width;
    var height;
    var filters =[];
    var opacity = 255;
    
    
    this.setName= function(n){ name =n; }
    
    
    this.getName = function(){ return name; }
    
    
    this.getPicture = function(){ return picture; }
    
    
    this.setPicture = function(pic){
        picture = pic;
        var dimen = picture.getDimension();
        width = dimen.width;
        height = dimen.height;
    }

    
    this.setPictureSrc = function(src){
        picture.setImageSrc(src);
        updateTempImage();
    }
    

    this.setDimension = function(w,h){
        width = w;
        height = h;
    }
    
    
    this.getDimension = function(){
        return {'width':width, 'height':height};
    }
    
    
    this.setZIndex = function(index){ zIndex = index; }
    
    
    this.getZIndex = function(){ return zIndex; }

    
    this.addFilter = function(fltr){
        filters.push(fltr);
        updateTempImage();
    }


    this.getFilters = function(){
        return filters;
    }

    
    /*
        *sets argument for filter 
        @params {Filter} fltr
        @params {Number} value
    */
    this.setFilterArgs = function(fltr, value){
        fltr.setArgs(value);
        updateTempImage();
    }


    /*
        *removes filter from filters array
        @params {Filter} fltr
    */
    this.removeFilter = function(fltr){
        var filterIndex = getFilterIndex(fltr);
        if(filterIndex){
            filters.splice(filterIndex,1);
        }

        updateTempImage();
    }

    
    this.getOpacity = function(){
        return opacity;
    }

    
    this.setOpacity = function(op){
        opacity = op;
        updateTempImage();
    }

    
    /*
        *disables filter in layer
        @params {Filter} fltr
    */
    this.disableFilter= function(fltr){
        fltr.disable();
        updateTempImage();
    }

    
    /*
        *enables filter in layer
        @params {Filter} fltr
    */
    this.enableFilter = function(fltr){
        fltr.enable();
        updateTempImage();
    }

    
    /*
        *updates the temporary image everytime when there is some change in original image
    */
    function updateTempImage(){
        var mainFilter = new Filter();
        var pixels = mainFilter.getPixels(picture);

        if(opacity!=null && opacity<255){
            //apply opacity
            for (var i = pixels.data.length - 1; i >= 0; i-=4) {
                if(pixels.data[i]!=0){
                    pixels.data[i]=opacity;    
                }
                
            };
        }


        for(var i in filters){
            //apply filters from filters array
            var filter = filters[i];
            if(filter.isActive()){
                pixels = filter.filterImage(filter.filter, pixels, filter.getArgs());
            }
        }


        //create temp canvas with the dimension equal to that of original image
        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');
        var tempImg = picture.getTempImage();

        tempCanvas.width = pixels.width;
        tempCanvas.height = pixels.height;
        tempCtx.putImageData(pixels,0,0);
        //update tempImg source
        tempImg.src = tempCanvas.toDataURL('image/png');
        tempImg.onload = function(){
            PhotoEditorUI.getInstance().renderLayers();
        }
    }


    /*
        *return fitler index in filters array
        @params {Filter} fltr
        @return {Number} suspectIndex
    */
    function getFilterIndex(fltr){
        var filter = fltr;
        var suspectIndex=null;
        for(var i in filters){
            if(filter.getName() == filters[i].getName()){
                suspectIndex = i;
                break;
            }
        }

        return suspectIndex;
    }
    
}