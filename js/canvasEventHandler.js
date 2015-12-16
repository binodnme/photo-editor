
var mousedown = false;
var imageSelected = false;
var borderSelected = false;

var xCorrection = 0;
var yCorrection = 0;

myCanvas.getCanvas().onmousedown = function(e1){
    mousedown = true;
    
    var x = e1.pageX - myCanvas.getCanvas().offsetLeft;
    var y = e1.pageY - myCanvas.getCanvas().offsetTop;

    var layer = getTopLayer(x,y);
    
    if(layer){    

        myCanvas.setActiveLayerIndex(layer.getZIndex());
    
        var dimen = layer.getPicture().getDimension();
        var pos = layer.getPicture().getPosition();
        
        myCanvas.renderLayers();
        drawOutline(pos, dimen);
        
        var ev1  = new CustomEvent('layerSelectInCanvas',{'detail':layer.getZIndex()});
        var ulist = document.getElementsByTagName('ul');

        for(var j=0; j<ulist.length; j++){
            ulist[j].dispatchEvent(ev1);
        }

        var actualPos;
        actualPos = layer.getPicture().getPosition();
        xCorrection = x-actualPos.posX;
        yCorrection = y-actualPos.posY;
    }
}


myCanvas.getCanvas().onmousemove = function(e2){
            
        var x1 = e2.pageX - myCanvas.getCanvas().offsetLeft;
        var y1 = e2.pageY - myCanvas.getCanvas().offsetTop;

        var zIndex = myCanvas.getActiveLayerIndex();
        var lyr = myCanvas.getLayerByZIndex(zIndex);
            
        if(selectTool){
            if(mousedown && imageSelected){

                lyr.getPicture().setPosition(x1-xCorrection,y1-yCorrection);
                ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
                
                myCanvas.renderLayers(); 
                
                var dimen = lyr.getPicture().getDimension();
                var finalX = x1-xCorrection;
                var finalY = y1-yCorrection;
                
                drawOutline({'posX':finalX, 'posY':finalY},dimen);   
            }
            
        }else if(transformTool){
            var position = lyr.getPicture().getPosition();
            var dimension = lyr.getPicture().getDimension();

            var side = isOverOutline(x1,y1,position,dimension);

            if(side){
                resizeLayer(lyr,side,x1,y1);
            }else{
                myCanvas.getCanvas().style.cursor = 'default';
            }
        }
}

function resizeLayer(layer, side, x1, y1){
    var lyr = layer;
    var pic = lyr.getPicture();
    var dimension = pic.getDimension();
    var position = pic.getPosition();

    if(side==1){
        //top
        cnvs.style.cursor = 'n-resize';    
        if(mousedown){
            pic.setDimension(dimension.width, dimension.height+position.posY-y1);
            pic.setPosition(position.posX, y1);
            myCanvas.renderLayers();
            drawOutline(position, dimension);
        }
    }else if(side==2){
        //bottom
        cnvs.style.cursor = 's-resize';
        if(mousedown){
            pic.setDimension(dimension.width, y1-position.posY);
            myCanvas.renderLayers();
            drawOutline(position, dimension);
        }
    }else if(side==3){
        //left
        cnvs.style.cursor = 'w-resize';
        if(mousedown){
            pic.setDimension(dimension.width+position.posX-x1, dimension.height);
            pic.setPosition(x1, position.posY);
            myCanvas.renderLayers();
            drawOutline(position, dimension);
        }
    }else if(side==4){
        //right
        cnvs.style.cursor = 'e-resize';
        if(mousedown){
            pic.setDimension(x1-position.posX, dimension.height);
            myCanvas.renderLayers();
            drawOutline(position, dimension);
        }
    }
    
}


function getTopLayer(x, y){

    var layers = myCanvas.getLayers();

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


myCanvas.getCanvas().onmouseup = function(){
    mousedown = false;
    imageSelected = false;
    // borderSelected = false;
}


myCanvas.getCanvas().addEventListener('layerSelectInList', function(ev){
    myCanvas.renderLayers();
    var zIndex = parseInt(ev.detail);
    var layers = myCanvas.getLayers();
    for(var i=0; i<layers.length; i++){
        if(layers[i].getZIndex() == zIndex){
            var pic = layers[i].getPicture();
            drawOutline(pic.getPosition(), pic.getDimension());
        }
    }
});