console.log('start');

var inputFileElmnt = document.getElementById('choose-file');
var getButton = document.getElementById('getButton');
var cnvs = document.getElementById('playground'); 

var myCanvas = new Canvas();
myCanvas.setCanvas(cnvs);
var ctx = myCanvas.getContext();

inputFileElmnt.onchange = function(event){
    console.log(event);
    var file = event.target.files[0];
    var fileReader = new FileReader();
    
    fileReader.onload = function(event1){
        console.log(event1);
        
        loadImage(event1.target.result);
        
    }
    
    fileReader.readAsDataURL(file);
}

getButton.onclick = function(){
    console.log('hey man');
    var url = document.getElementById('url');
    
    if(url.value){
        loadImage(url.value);
    }else{
        console.log('blank');
    }
}

function loadImage(src){
    
    console.log('source:',src);
    var img = new Image();
    img.src = src;

    var picture = new Picture();
    picture.setImage(img);

    var layer = new Layer();
    layer.setPicture(picture);
 
    myCanvas.addLayer(layer);
   
    picture.getImage().onload = function(){
        console.log('width: ',picture.getImage().width, ' height:',picture.getImage().height);
        picture.setDimension(picture.getImage().width, picture.getImage().height);
        myCanvas.renderLayers();
        updateLayerUI(layer);
    }
}

var mousedown = false;
var imageSelected = false;

myCanvas.getCanvas().onmousedown = function(e1){
    mousedown = true;
    
    var x = event.pageX - myCanvas.getCanvas().offsetLeft;
    var y = event.pageY - myCanvas.getCanvas().offsetTop;
    
    var index;
    
    var layers = myCanvas.getLayers();
    for(var i in layers){
        var dimen = layers[i].getPicture().getDimension();
        var pos = layers[i].getPicture().getPosition();
        if(x>=pos.posX && x<=(pos.posX+dimen.width) && y>=pos.posY && y<=(pos.posY+dimen.height)){
            imageSelected = true;
            index = i;
            break;
        }    
    }
    
    
    var actualPos = layers[index].getPicture().getPosition();
    
    var xCorrection = x-actualPos.posX;
    var yCorrection = y-actualPos.posY;
    
    myCanvas.getCanvas().onmousemove = function(e2){
        if(mousedown && imageSelected){
            var x1 = event.pageX - myCanvas.getCanvas().offsetLeft;
            var y1 = event.pageY - myCanvas.getCanvas().offsetTop;
            layers[index].getPicture().setPosition(x1-xCorrection,y1-yCorrection);
            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
            
            console.log('zindex: ',layers[index].getZIndex());

            myCanvas.renderLayers(); 
            
            var dimen = layers[index].getPicture().getDimension();
            
            var x = x1-xCorrection;
            var y = y1-yCorrection;
            
            ctx.setLineDash([2,6]);
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x+dimen.width, y);
            ctx.lineTo(x+dimen.width,y+dimen.height);
            ctx.lineTo(x, y+dimen.height);
            ctx.lineTo(x, y);
            ctx.strokeStyle='red';
            ctx.stroke();
        }
    }
}

myCanvas.getCanvas().onmouseup = function(){
    mousedown = false;
    imageSelected = false;
}

function updateLayerUI(layer){
    var layers = document.getElementById('layer-list');
    
    var li = document.createElement('li');
    li.innerHTML = layer.getZIndex();
    
    layers.appendChild(li);
    
}
//
//myCanvas.getCanvas().onkeydown = function(event){
//    var key = event.keyCode;
//    
//    if(key==32){
//        console.log('key: ',key);  
//        var layers = myCanvas.getLayers();
//        layers[0].setZIndex(1);
//        layers[1].setZIndex(0);
//        myCanvas.renderLayers();
//    }else{  //a
//        
//        
//        var picture = myCanvas.getLayers()[0].getPicture();
//        var image = picture.getImage();
//        var dimen = picture.getDimension();
//        var width = dimen.width;
//        var height = dimen.height;
//        var position = picture.getPosition();
//        var posX = position.posX;
//        var posY = position.posY;
//        
//        if(key==65){
//            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
//            ctx.drawImage(image, posX, posY, width*0.5, height*0.5);    
//        }else if(key==66){
//            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
//            ctx.drawImage(image, posX, posY, width*2, height*2);
//        }
//        
//    }
//}
//
//
var zoomLevel = 1;
myCanvas.getCanvas().onmousewheel = function(event){
    
    var deltaYVlaue = event.deltaY;
    console.log(deltaYVlaue)
    
//    var picture = myCanvas.getLayers()[0].getPicture();
//    var image = picture.getImage();
//    var dimen = picture.getDimension();
//    var width = dimen.width;
//    var height = dimen.height;
//    var position = picture.getPosition();
//    var posX = position.posX;
//    var posY = position.posY;
    ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
    
    
    if(deltaYVlaue>0){
        zoomLevel/=1.1;
    }else{
        zoomLevel*=1.1;
        
    }
//    ctx.drawImage(image, posX, posY, width*zoomLevel, height*zoomLevel); 
    myCanvas.renderLayers(zoomLevel);
}