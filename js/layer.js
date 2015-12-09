function Layer(){
    var id;
    var zIndex;
    var pictures = [];
    var width;
    var height;
    
    this.setId = function(i){   id = i; }
    
    this.getId = function(){ return id; }
    
    this.getPictures = function(){ return pictures; }
    
    this.addPicture = function(picture){ pictures.push(picture); }
    
    this.removePicture = function(index){ pictures.splice(index,1);}
    
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