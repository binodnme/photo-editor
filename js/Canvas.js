function Canvas(){
    var canvasElement;
    var context;
    var width;
    var height;

    var xCorrection;
    var yCorrection;
    var mouseDownPosX;
    var mouseDownPosY;
    var mousedown = false;
    var imageSelected = false;


    /*
        *Initializes canvas element and adds event listener
    */
    this.init = function(){
        canvasElement = document.getElementById('playground');
        context = canvasElement.getContext('2d');
        
        canvasElement.width = 900;
        canvasElement.height = 500;
        width = 900;
        height = 500;

        canvasElement.addEventListener('mousedown', handlerMouseDown, false);
        canvasElement.addEventListener('mouseup', handlerMouseUp, false);
        canvasElement.addEventListener('mousemove', handlerMouseMove, false);
        canvasElement.addEventListener('layerSelectInList', handlerLayerSelectInList, false);
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


    /*
        *handles mousedown event in canvas
        @params {MouseEvent} e
    */
    function handlerMouseDown(e){
        mousedown = true;
        var x = e.pageX - canvasElement.offsetLeft;
        var y = e.pageY - canvasElement.offsetTop;

        mouseDownPosX = x;
        mouseDownPosY = y;

        var layer = getTopLayer(x,y);

        if(layer){
            //fire custom event and attach layer's z-index value
            var ev1  = new CustomEvent('layerSelectInCanvas',{'detail':layer.getZIndex()});
            var list = document.getElementsByTagName('li');
            var ulist = document.getElementsByTagName('ul');

            for(var j=0; j<list.length; j++){
                list[j].dispatchEvent(ev1);
            }

            for(var j=0; j<ulist.length; j++){
                ulist[j].dispatchEvent(ev1);
            }


            PhotoEditor.getInstance().setActiveLayerIndex(layer.getZIndex());
            var activeTool = PhotoEditor.getInstance().getActiveTool();
            
            
            if(activeTool=='lasso'){
                LassoTool.getInstance().addCoordinate(x,y);
                
            }else if(activeTool == 'color'){
                var x = e.layerX;
                var y = e.layerY;
                var pixeldata = context.getImageData(x, y, 1, 1);
                var col = pixeldata.data;
                ColorReplace.getInstance().setSourceColor(col, 'click');

            }else if(activeTool == 'transform'){
                var position = layer.getPicture().getPosition();
                var dimension = layer.getPicture().getDimension();   

                var side = isOverOutline(x,y,position,dimension);
                TransformTool.getInstance().enableMouseDown();
                TransformTool.getInstance().setSide(side);
                
                PhotoEditorUI.getInstance().renderLayers();
                drawOutline(position, dimension);

            }else{
                var dimen = layer.getPicture().getDimension();
                var pos = layer.getPicture().getPosition();
                
                context.clearRect(0,0,width, height);

                PhotoEditorUI.getInstance().renderLayers();
                drawOutline(pos, dimen);
                
                var actualPos;
                actualPos = layer.getPicture().getPosition();
                xCorrection = x-actualPos.posX;
                yCorrection = y-actualPos.posY;    
            }
            
        }
    }


    /*
        *handles mousemove event in canvas
        @params {MouseEvent} e
    */
    function handlerMouseMove(e){
        var x1 = e.pageX - canvasElement.offsetLeft;
        var y1 = e.pageY - canvasElement.offsetTop;

        var photoEditor = PhotoEditor.getInstance();

        var zIndex = photoEditor.getActiveLayerIndex();
        var lyr = photoEditor.getLayerByZIndex(zIndex);
        
        if(!lyr){
            return;
        }

        var activeTool = photoEditor.getActiveTool();

        if(activeTool=='select'){
            if(mousedown && imageSelected){
                lyr.getPicture().setPosition(x1-xCorrection,y1-yCorrection);

                context.clearRect(0,0,width,height);
                PhotoEditorUI.getInstance().renderLayers(); 
                
                var dimen = lyr.getPicture().getDimension();
                var finalX = x1-xCorrection;
                var finalY = y1-yCorrection;
                
                drawOutline({'posX':finalX, 'posY':finalY},dimen);   
            } 
            
        }else if(activeTool=='transform'){
            if(lyr){
                var position = lyr.getPicture().getPosition();
                var dimension = lyr.getPicture().getDimension();   

                if(!TransformTool.getInstance().isMouseDown()){
                    var side = isOverOutline(x1,y1,position,dimension);
                    
                    if(side==1){
                        //top
                        this.style.cursor = 'n-resize'; 
                    }else if(side==2){
                        //bottom
                        this.style.cursor = 's-resize';
                    }else if(side==3){
                        //left
                        this.style.cursor = 'w-resize';
                    }else if(side==4){
                        //right
                        this.style.cursor = 'e-resize';
                    }else{
                        this.style.cursor = 'default';
                    }

                }

                var tempSide = TransformTool.getInstance().getSide();
                if(TransformTool.getInstance().isMouseDown() && tempSide){
                    resizeLayer(lyr,tempSide,x1,y1);
                    
                    var dimen = lyr.getPicture().getDimension();
                    var pos = lyr.getPicture().getPosition();
                    
                    PhotoEditorUI.getInstance().renderLayers();
                    drawOutline(pos,dimen);
                } 
                
            }

        }else if(activeTool=='crop'){
            if(mousedown){
                PhotoEditorUI.getInstance().renderLayers();
                context.strokeRect(mouseDownPosX, mouseDownPosY, x1-mouseDownPosX, y1-mouseDownPosY);
                CropTool.getInstance().setParameters(mouseDownPosX, mouseDownPosY, x1, y1);
            }
        }else if(activeTool == 'color'){
            var x = e.layerX;
            var y = e.layerY;
            var pixeldata = context.getImageData(x, y, 1, 1);
            var col = pixeldata.data;
            ColorReplace.getInstance().setSourceColor(col);
        }

    }


    /*
        *handles mouseup event in canvas
        @params {MouseEvent} e
    */
    function handlerMouseUp(e){
        mousedown = false;
        imageSelected = false;
        var activeTool = PhotoEditor.getInstance().getActiveTool();

        if(activeTool=='crop'){
            CropTool.getInstance().crop();
        }else if(activeTool == 'transform'){
            TransformTool.getInstance().disableMouseDown();
            canvasElement.style.cursor = 'default';
        }
    }


    /*
        *handles layerSelectInList event in canvas
        @params {CustomEvent} e
    */
    function handlerLayerSelectInList(e){
        var layer = PhotoEditor.getInstance().getActiveLayer();
        var pic = layer.getPicture();
        PhotoEditorUI.getInstance().renderLayers();
        drawOutline(pic.getPosition(), pic.getDimension());

    }


    /*
        *returns the topmost layer when the mouse is clicked/moved in canvas
        @params {Number} x
        @params {Number} y
        @return {Layer} 
    */
    function getTopLayer(x, y){
        var layers = PhotoEditor.getInstance().getLayers();

        var indices = [];
        //record the index of all layers under the mouse cursor
        for(var i in layers){
            var dimen = layers[i].getPicture().getDimension();
            var pos = layers[i].getPicture().getPosition();
            if(x>=pos.posX && x<=(pos.posX+dimen.width) && y>=pos.posY && y<=(pos.posY+dimen.height)){
                imageSelected = true;
                indices.push(i);
            }    
        }

        //find outs the topmost layer
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

   
    /*
        *resize the picture/layer
        @params {Layer} layer
        @params {Number} side
        @params {Number} x1
        @params {Number} y1
    */
    function resizeLayer(layer, side, x1, y1){
        var lyr = layer;
        var pic = lyr.getPicture();
        var dimension = pic.getDimension();
        var position = pic.getPosition();

        var pUI = PhotoEditorUI.getInstance();

        if(side==1){
            //top
            canvasElement.style.cursor = 'n-resize'; 
            if(mousedown){
                pic.setDimension(dimension.width, dimension.height+position.posY-y1);
                pic.setPosition(position.posX, y1);
                pUI.renderLayers();
                drawOutline(position, dimension);    
            }  
            
        
        }else if(side==2){
            //bottom
            canvasElement.style.cursor = 's-resize';
            if(mousedown){
                pic.setDimension(dimension.width, y1-position.posY);
                pUI.renderLayers();
                drawOutline(position, dimension);
            }
            
        
        }else if(side==3){
            //left
            canvasElement.style.cursor = 'w-resize';
            if(mousedown){
                pic.setDimension(dimension.width+position.posX-x1, dimension.height);
                pic.setPosition(x1, position.posY);
                pUI.renderLayers();
                drawOutline(position, dimension);    
            }
            
        }else if(side==4){
            //right
            canvasElement.style.cursor = 'e-resize';
            if(mousedown){
                pic.setDimension(x1-position.posX, dimension.height);
                pUI.renderLayers();
                drawOutline(position, dimension);    
            }
            
        }
        
    }


    
}