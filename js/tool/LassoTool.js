
var LassoTool = (function(){
    var iconSrc = 'images/icons/lasso.png';   //source for icon file
    var coordinateArray = [];
    var activeLayer;

    function LassoTool() {
        var name='lasso';
        // var 

        
        this.getName = function(){
            return name;
        }

        this.getIconSrc = function(){
            return iconSrc;
        }


        this.getCoordinateArray = function(){
            return coordinateArray;
        }

        this.addCoordinate = function(x,y){
            var canvasObj = PhotoEditorUI.getInstance().getCanvas();
            var canvas = canvasObj.getCanvasElement();
            var ctx = canvasObj.getContext();

            ctx.save();
            
            if(coordinateArray.length==0){
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.moveTo(x, y);
                coordinateArray.push([x,y]);
                ctx.save();
                drawMiniDots(ctx,x, y);
                ctx.restore();

                var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
                activeLayer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);

            }else if(coordinateArray.length>=3){
                var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
                var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);

                if(layer!=activeLayer){
                    return false;
                }

                var initX = coordinateArray[0][0];
                var initY = coordinateArray[0][1];

                if(Math.abs(initX-x)<5 && Math.abs(initY-y)<5){
                    ctx.closePath();

                    var minX, minY, maxX,maxY;
                    for (var i = coordinateArray.length - 1; i >= 0; i--) {
                        if(i==coordinateArray.length-1){
                            minX=maxX = coordinateArray[i][0];
                            minY=maxY = coordinateArray[i][1];
                        }else{
                            if(coordinateArray[i][0]<minX){
                                minX = coordinateArray[i][0];
                            }else if(coordinateArray[i][0]>maxX){
                                maxX = coordinateArray[i][0];
                            }

                            if(coordinateArray[i][1]<minY){
                                minY = coordinateArray[i][1];
                            }else if(coordinateArray[i][1]>maxY){
                                maxY = coordinateArray[i][1];
                            }
                        }
                    };


                    if(minX==maxX || minY==maxY ){
                        return null;
                    }else{
                        PhotoEditorUI.getInstance().renderLayers();

                        var pic = activeLayer.getPicture();

                        var canvasTest = document.createElement('canvas');
                        // var canvasTest = document.getElementById('testground');
                        canvasTest.width = maxX - minX;
                        canvasTest.height = maxY - minY;

                        var context = canvasTest.getContext('2d');

                        console.info('minX, minY: ',minX, ',',minY, ' maxX, maxY: ',maxX,',',maxY);
                        context.beginPath();
                        context.moveTo(coordinateArray[0][0]-minX, coordinateArray[0][1]-minY);

                        for(var i=1; i<coordinateArray.length; i++){
                            context.lineTo(coordinateArray[i][0]-minX, coordinateArray[i][1]-minY);
                            console.log('x,y: ',coordinateArray[i][0]-minX,',',coordinateArray[i][1]-minY);
                        }
                        context.clip();
                        context.stroke();

                        var pos = pic.getPosition();
                        context.drawImage(pic.getImage(), minX-pos.posX, minY-pos.posY, maxX-minX, maxY-minY,
                            0,0,maxX-minX, maxY-minY);
                        //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                        var img = document.createElement('img');
                        img.src = canvasTest.toDataURL("image/png");

                        activeLayer.getPicture().setImageSrc(img.src);
                        activeLayer.getPicture().setPosition(minX, minY);

                        PhotoEditorUI.getInstance().renderLayers();

                        coordinateArray = [];

                    }


                }else{
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    coordinateArray.push([x, y]);
                    ctx.save();
                    drawMiniDots(ctx,x, y); 
                    ctx.restore();
                }
            }else{
                var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
                var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);

                if(layer!=activeLayer){
                    return false;
                }

                ctx.lineTo(x, y);
                ctx.stroke();
                coordinateArray.push([x, y]);
                ctx.save();
                drawMiniDots(ctx,x, y); 
                ctx.restore();
            }
            ctx.restore();
            
        }

        this.reset = function(){
            coordinateArray = [];
            console.info('reset lasso tool');
        }

        function drawMiniDots(ctx,x,y){
            var offset = 2;
            ctx.strokeStyle = 'white';
            ctx.strokeRect(x-offset, y-offset, offset*2, offset*2);
        }
    	    
    }


    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new LassoTool();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
})();


PhotoEditor.getInstance().addTool(LassoTool.getInstance());