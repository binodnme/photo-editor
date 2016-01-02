var LassoTool = (function(){
    
    function LassoTool() {
        var name='lasso';
        var iconSrc = 'images/icons/lasso1.png';   //source for icon file
        var coordinateArray = [];
        var activeLayer;
    
        this.getName = function(){
            return name;
        }

        this.getIconSrc = function(){
            return iconSrc;
        }


        this.getCoordinateArray = function(){
            return coordinateArray;
        }


        /*adds coordinate to the coordinateArray and crops the closed path*/
        this.addCoordinate = function(x,y){
            var canvasObj = PhotoEditorUI.getInstance().getCanvas();
            var canvas = canvasObj.getCanvasElement();
            var ctx = canvasObj.getContext();

            ctx.save();
            
            if(coordinateArray.length==0){
                //initiate the path on the first click
                ctx.beginPath();
                ctx.strokeStyle = 'red';
                ctx.moveTo(x, y);
                coordinateArray.push([x,y]);
                ctx.save();
                drawMiniDots(ctx,x, y);
                ctx.restore();

                var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
                activeLayer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);

            }else if(coordinateArray.length>=3){    //this is the condition to form valid close path
                var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
                var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);

                if(layer!=activeLayer){
                    return false;
                }

                var initX = coordinateArray[0][0];
                var initY = coordinateArray[0][1];


                //difference of atmost 5 pixels is considered to form a close path
                if(Math.abs(initX-x)<5 && Math.abs(initY-y)<5){
                    ctx.closePath();

                    var minX, minY, maxX,maxY;
                    //this block find outs the max and min values of x & y coordinate from the all coordinates in coordinateArray
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


                        //temp canvas with the dimension equal to the selected region is created
                        var canvasTest = document.createElement('canvas');
                        // var canvasTest = document.getElementById('testground');
                        canvasTest.width = maxX - minX;
                        canvasTest.height = maxY - minY;

                        var context = canvasTest.getContext('2d');

                        context.beginPath();
                        context.moveTo(coordinateArray[0][0]-minX, coordinateArray[0][1]-minY);

                        //user provided path is traced in temp canvas
                        for(var i=1; i<coordinateArray.length; i++){
                            context.lineTo(coordinateArray[i][0]-minX, coordinateArray[i][1]-minY);
                            console.log('x,y: ',coordinateArray[i][0]-minX,',',coordinateArray[i][1]-minY);
                        }

                        //----------------IMPORTANT----------------------
                        //context.clip() allows rendering only in the closed path 
                        //i.e it acts as a mask to hide unwanted parts of image
                        context.clip();
                        // context.stroke();

                        var pos = pic.getPosition();
                        var image = pic.getImage();
                        var dimen = pic.getDimension();

                        //actual image dimension is used to preserve the image quality
                        var actualWidth = (maxX - minX)*(image.width/dimen.width);
                        var actualheight = (maxY - minY)*(image.height/dimen.height);

                        var actualStartX = (minX-pos.posX)*(image.width/dimen.width);
                        var actualStartY = (minY-pos.posY)*(image.height/dimen.height);


                        context.drawImage(pic.getImage(), actualStartX, actualStartY, actualWidth, actualheight,
                            0,0,maxX-minX, maxY-minY);
                        //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

                        var img = document.createElement('img');
                        img.src = canvasTest.toDataURL("image/png");

                        //update the image source of picture
                        activeLayer.setPictureSrc(img.src);
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


        /*
            *draws small rectangular dots at the edge of path
            @params {CanvasRenderingContext2D} ctx
            @params {Number} x
            @params {Number} y
        */
        function drawMiniDots(ctx,x,y){
            var offset = 2;
            ctx.strokeStyle = 'white';
            ctx.strokeRect(x-offset, y-offset, offset*2, offset*2);
        }
    	    
    }


    //this approach is used to make Class Singleton
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

//register tool in PhotoEditor tools
PhotoEditor.getInstance().addTool(LassoTool.getInstance());