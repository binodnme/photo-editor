function Layer(){
    var id;
    var zIndex;
    var picture;
    var width;
    var height;
    
    this.setId = function(i){   id = i; }
    
    this.getId = function(){ return id; }
    
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
    
    
}