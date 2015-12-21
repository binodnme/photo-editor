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
    
//    this.addPicture = function(picture){ pictures.push(picture); }
//    
//    this.removePicture = function(index){ pictures.splice(index,1);}
    
    this.setDimension = function(w,h){
        width = w;
        height = h;
    }
    
    this.getDimension = function(){
        return {'width':width, 'height':height};
    }
    
    this.setZIndex = function(index){ zIndex = index; }
    
    this.getZIndex = function(){ return zIndex; }

    // this.setFilter = function(fltr){
    //     filter = fltr;
    // }
    
    this.getFilters = function(){
        return filters;
    }

    this.getOpacity = function(){
        return opacity;
    }

    this.setOpacity = function(op){
        opacity = op;
    }
    
}