function Layer(){
    var id;
    var name;
    var zIndex;
    var picture;
    var width;
    var height;
    var filters =[];
    var opacity = 255;
    

    this.setId = function(i){   id = i; }
    
    
    this.getId = function(){ return id; }
    
    
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
        // console.log('from getter: ', filters);
        return filters;
    }

    
    this.setFilterArgs = function(fltr, value){
        fltr.setArgs(value);
        updateTempImage();
    }


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
        // picture.setOpacity(op);
        updateTempImage();
    }

    
    this.disableFilter= function(fltr){
        fltr.disable();
        updateTempImage();
    }

    
    this.enableFilter = function(fltr){
        fltr.enable();
        updateTempImage();
    }

    
    function updateTempImage(){
        var mainFilter = new Filter();
        var pixels = mainFilter.getPixels(picture);

        if(opacity!=null && opacity<255){
            for (var i = pixels.data.length - 1; i >= 0; i-=4) {
                pixels.data[i]=opacity;      
            };
        }


        for(var i in filters){
            var filter = filters[i];
            if(filter.isActive()){
                pixels = filter.filterImage(filter.filter, pixels, filter.getArgs());
            }
        }

        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');
        var tempImg = picture.getTempImage();

        tempCanvas.width = pixels.width;
        tempCanvas.height = pixels.height;
        tempCtx.putImageData(pixels,0,0);
        tempImg.src = tempCanvas.toDataURL('image/png');
        tempImg.onload = function(){
            PhotoEditorUI.getInstance().renderLayers();
        }
        // console.log('data', pixels.data);
    }


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