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
    
    var x = e1.pageX - myCanvas.getCanvas().offsetLeft;
    var y = e1.pageY - myCanvas.getCanvas().offsetTop;
    
    var index;
    
    var layers = myCanvas.getLayers();
    for(var i in layers){
        var dimen = layers[i].getPicture().getDimension();
        var pos = layers[i].getPicture().getPosition();
        if(x>=pos.posX && x<=(pos.posX+dimen.width) && y>=pos.posY && y<=(pos.posY+dimen.height)){
            imageSelected = true;
            index = i;

            var xCor = pos.posX;
            var yCor = pos.posY;
            myCanvas.renderLayers();
            drawOutline({'x':xCor, 'y':yCor}, dimen);

            break;
        }    
    }
    
    // console.log('index',index);

    var actualPos, xCorrection, yCorrection;
    if(index){
        actualPos = layers[index].getPicture().getPosition();
    
        xCorrection = x-actualPos.posX;
        yCorrection = y-actualPos.posY;
        
    }
    
    myCanvas.getCanvas().onmousemove = function(e2){
        if(mousedown && imageSelected){
            var x1 = e2.pageX - myCanvas.getCanvas().offsetLeft;
            var y1 = e2.pageY - myCanvas.getCanvas().offsetTop;
            layers[index].getPicture().setPosition(x1-xCorrection,y1-yCorrection);
            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
            
            // console.log('zindex: ',layers[index].getZIndex());

            myCanvas.renderLayers(); 
            
            var dimen = layers[index].getPicture().getDimension();
            
            // console.log('dimen:',dimen);
            var finalX = x1-xCorrection;
            var finalY = y1-yCorrection;
            
            drawOutline({'x':finalX, 'y':finalY},dimen);
            // ctx.setLineDash([2,6]);
            // ctx.beginPath();
            // ctx.moveTo(x,y);
            // ctx.lineTo(x+dimen.width, y);
            // ctx.lineTo(x+dimen.width,y+dimen.height);
            // ctx.lineTo(x, y+dimen.height);
            // ctx.lineTo(x, y);
            // ctx.strokeStyle='red';
            // ctx.stroke();
        }
    }
}

function drawOutline(pos, dimen){
    // console.log('pos',pos);
    ctx.setLineDash([2,6]);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x+dimen.width, pos.y);
    ctx.lineTo(pos.x+dimen.width,pos.y+dimen.height);
    ctx.lineTo(pos.x, pos.y+dimen.height);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle='red';
    ctx.stroke();
}

myCanvas.getCanvas().onmouseup = function(){
    mousedown = false;
    imageSelected = false;
}

function updateLayerUI(layer){
    var layers = document.getElementById('layer-list');

    if(layer){
        var li = document.createElement('li');
        li.innerHTML = layer.getZIndex();
        li.setAttribute('id', layer.getZIndex());

        console.log('zindex: ', layer.getZIndex(),', active:',myCanvas.getActiveLayerIndex());
        layers.appendChild(li);
    }
    
    
    var activeLayerIndex = myCanvas.getActiveLayerIndex(); 
    var children = layers.children;
    
    for(var i=0; i<children.length; i++){
        if(parseInt(children[i].getAttribute('id'))== activeLayerIndex){
            children[i].style.background = 'grey';
        }else{
            children[i].style.background = 'white';
        }
    }
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
myCanvas.getCanvas().onwheel = function(event){
    
    var deltaYVlaue = event.deltaY;
    console.log(deltaYVlaue)
    
    ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
    
    
    if(deltaYVlaue>0){
        zoomLevel/=1.1;
    }else{
        zoomLevel*=1.1;
        
    }
    myCanvas.renderLayers(zoomLevel);
}


var propWidth = document.getElementById('prop-width');
var propHeight = document.getElementById('prop-height');

// console.log(propWidth);
propWidth.onchange = function(eChange){
    var layer = myCanvas.getLayers()[0];
    resize(eChange, layer);
}

propHeight.onchange = function(event){
    var layer = myCanvas.getLayers()[0];
    resize(event, layer);
}

function resize(event, lyr){
    var layer = lyr;
    var pic = layer.getPicture();

    var w = parseInt(propWidth.value);
    var h = parseInt(propHeight.value);

    var dimen = pic.getDimension();

    var width;
    var height;
    if(w){
        width = w;
    }else{
        width = dimen.width;
    }

    if(h){
        height = h;
    }else{
        height = dimen.height;
    }
    
    console.log('width', width);
    console.log('height', height);
    pic.setDimension(width, height);

    ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
    myCanvas.renderLayers();
}