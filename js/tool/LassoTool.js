
var LassoTool = (function(){
    var iconSrc = '';   //source for icon file
    var coordinateArray = [];

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
            // console.info('x,y : ',x,',',y);
            // console.info('ctx:',ctx);

            if(coordinateArray.length==0){
                // console.info('start');
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.moveTo(x, y);
                coordinateArray.push([x,y]);
                ctx.save();
                drawMiniDots(ctx,x, y);
                ctx.restore();
            }else if(coordinateArray.length>=3){
                var initX = coordinateArray[0][0];
                var initY = coordinateArray[0][1];

                if(Math.abs(initX-x)<5 && Math.abs(initY-y)<5){
                    // console.info('done');
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
                        var img = document.createElement('img')
                        img.src = canvas.toDataURL('image/png');

                        var canvasTest = document.createElement('canvas');
                        // var canvasTest = document.getElementById('testground');
                        canvasTest.width = canvas.width;
                        canvasTest.height = canvas.height;
                        var context = canvasTest.getContext('2d');

                        context.beginPath();
                        context.moveTo(coordinateArray[0][0], coordinateArray[0][1]);

                        for(var i=1; i<coordinateArray.length; i++){
                            context.lineTo(coordinateArray[i][0], coordinateArray[i][1]);
                        }
                        context.clip();
                        context.stroke();
                        context.drawImage(img, 0,0);

                        console.info('maxX',maxX,' maxY',maxY,' minX',minX,' minY',minY);

                        var imageData = context.getImageData(minX, minY, maxX-minX, maxY-minY);



                        var canvasTemp = document.createElement("canvas");
                        canvasTemp.width = maxX - minX;
                        canvasTemp.height = maxY - minY;

                        var ctx = canvasTemp.getContext("2d");
                        ctx.putImageData(imageData,0,0);

                        var img = document.createElement("img");
                        img.src = canvasTemp.toDataURL("image/png");


                        var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
                        var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);

                        layer.getPicture().setImageSrc(img.src);
                        layer.getPicture().setPosition(minX, minY);

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
                    // console.info('go on');    
                }
            }else{
                ctx.lineTo(x, y);
                ctx.stroke();
                coordinateArray.push([x, y]);
                ctx.save();
                drawMiniDots(ctx,x, y); 
                ctx.restore();
                // console.info('go on');
            }
            
            ctx.restore();
            
            // return true;

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