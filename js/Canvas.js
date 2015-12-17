function Canvas(){
    var canvasElement;
    var context;
    var width;
    var height;

    var xCorrection;
    var yCorrection;
    var mousedown = false;



    this.init = function(){
        canvasElement = document.getElementById('playground');
        context = canvasElement.getContext('2d');
        
        canvasElement.width = 600;
        canvasElement.height = 400;
        width = 600;
        height = 400;

        canvasElement.addEventListener('mousedown', handlerMouseDown, false);
        canvasElement.addEventListener('mouseup', handlerMouseUp, false);
        canvasElement.addEventListener('mousemove', handlerMouseMove, false);
    }
    
    this.setCanvasElement = function(c){ 
        canvasElement = c;
        context = canvasElement.getContext('2d');
    }
    
    this.getCanvasElement = function(){ return canvasElement; }
    

    this.getContext = function(){
        if(context){
            return context;
        }
        return undefined;
    }
    

    this.setDimension = function(w, h){
        width = w;
        height = h;
        canvasElement.width = w;
        canvasElement.height = h;
    }
    

    this.getDimension = function(){
        return {'width':width, 'height':height};
    }



    function handlerMouseDown(e){

        mousedown = true;
    
        var x = e.pageX - canvasElement.offsetLeft;
        var y = e.pageY - canvasElement.offsetTop;

        var layer = getTopLayer(x,y);
    
        if(layer){    

            Photoshop.getInstance().setActiveLayerIndex(layer.getZIndex());
        
            var dimen = layer.getPicture().getDimension();
            var pos = layer.getPicture().getPosition();
            
            PhotoshopUI.getInstance().renderLayers();
            console.log('layer select');
            drawOutline(pos, dimen);
            
            var ev1  = new CustomEvent('layerSelectInCanvas',{'detail':layer.getZIndex()});
            var ulist = document.getElementsByTagName('li');

            for(var j=0; j<ulist.length; j++){
                ulist[j].dispatchEvent(ev1);
            }

            var actualPos;
            actualPos = layer.getPicture().getPosition();
            xCorrection = x-actualPos.posX;
            yCorrection = y-actualPos.posY;
        }
    }



    function handlerMouseUp(){

    }

    function handlerMouseMove(e){
        var x1 = e.pageX - canvasElement.offsetLeft;
        var y1 = e.pageY - canvasElement.offsetTop;

        var photoshop = Photoshop.getInstance();

        var zIndex = photoshop.getActiveLayerIndex();
        var lyr = photoshop.getLayerByZIndex(zIndex);
           

        if(mousedown && imageSelected){

            lyr.getPicture().setPosition(x1-xCorrection,y1-yCorrection);
            context.clearRect(0,0,width,height);
            
            PhotoshopUI.getInstance().renderLayers(); 
            
            var dimen = lyr.getPicture().getDimension();
            var finalX = x1-xCorrection;
            var finalY = y1-yCorrection;
            
            drawOutline({'posX':finalX, 'posY':finalY},dimen);   
        } 
        // if(selectTool){
        //     if(mousedown && imageSelected){

        //         lyr.getPicture().setPosition(x1-xCorrection,y1-yCorrection);
        //         ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
                
        //         myCanvas.renderLayers(); 
                
        //         var dimen = lyr.getPicture().getDimension();
        //         var finalX = x1-xCorrection;
        //         var finalY = y1-yCorrection;
                
        //         drawOutline({'posX':finalX, 'posY':finalY},dimen);   
        //     }
            
        // }else if(transformTool){
        //     var position = lyr.getPicture().getPosition();
        //     var dimension = lyr.getPicture().getDimension();

        //     var side = isOverOutline(x1,y1,position,dimension);

        //     if(side){
        //         resizeLayer(lyr,side,x1,y1);
        //     }else{
        //         myCanvas.getCanvas().style.cursor = 'default';
        //     }
        // }

    }

    function handlerMouseUp(){
        mousedown = false;
        imageSelected = false;
    }


    function getTopLayer(x, y){

        var layers = Photoshop.getInstance().getLayers();

        var indices = [];
        for(var i in layers){
            var dimen = layers[i].getPicture().getDimension();
            var pos = layers[i].getPicture().getPosition();
            if(x>=pos.posX && x<=(pos.posX+dimen.width) && y>=pos.posY && y<=(pos.posY+dimen.height)){
                imageSelected = true;
                indices.push(i);
            }    
        }

        if(indices.length>0){
            var hZIndex = -1;
            var hIndex = -1;
            for (var i = indices.length - 1; i >= 0; i--) {
                var j = indices[i];

                if(layers[j].getZIndex()>hZIndex){
                    hZIndex = layers[j].getZIndex();
                    hIndex = j;
                }
            };   

            return layers[hIndex]; 
        }

        return null;

}

    
}