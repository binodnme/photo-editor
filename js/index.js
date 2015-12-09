console.log('start');


//testing
var c = document.getElementById('playground');
var myCanvas = new Canvas();
myCanvas.setCanvas(c);
//var canvas = myCanvas.getCanvas();


//var ctx = canvas.getContext('2d');

var ctx = myCanvas.getContext();

var layer1 = new Layer();
var layer2 = new Layer();


var image1 = new Image();
image1.src = "./images/a.jpg";

var image2 = new Image();
image2.src = "./images/b.jpg";

//var arr = [];
var pic1 = new Picture();
pic1.setImage(image1);

//arr.push(pic1);

var pic2 = new Picture();
pic2.setImage(image2);

//arr.push(pic2);

layer1.setPicture(pic1);
layer2.setPicture(pic2);

myCanvas.addLayer(layer1);
myCanvas.addLayer(layer2);
myCanvas.renderLayers();


pic1.getImage().onload = function(){
    pic1.setDimension(pic1.getImage().width, pic1.getImage().height);
    pic1.draw(ctx,0,0);
//    ctx.drawImage(pic.getImage(),0,0);
}

pic2.getImage().onload = function(){
    pic2.setDimension(pic2.getImage().width, pic2.getImage().height);
    pic2.draw(ctx,100,100);
//    ctx.drawImage(pic.getImage(),0,0);
}


var mousedown = false;
var imageSelected = false;

myCanvas.getCanvas().onmousedown = function(e1){
//    console.log('hello down');
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
//            console.log(imageSelected);
            index = i;
            break;
        }    
    }
    
    
    myCanvas.getCanvas().onmousemove = function(e2){
        if(mousedown && imageSelected){
            var x1 = event.pageX - myCanvas.getCanvas().offsetLeft;
            var y1 = event.pageY - myCanvas.getCanvas().offsetTop;
            layers[index].getPicture().setPosition(x1,y1);
            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
            
            console.log('zindex: ',layers[index].getZIndex());

            myCanvas.renderLayers(); 
            
            var dimen = layers[index].getPicture().getDimension();
            
            ctx.setLineDash([2,6]);
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x1+dimen.width, y1);
            ctx.lineTo(x1+dimen.width,y1+dimen.height);
            ctx.lineTo(x1, y1+dimen.height);
            ctx.lineTo(x1,y1);
            ctx.strokeStyle='red';
            ctx.stroke();
        }
    }
}

myCanvas.getCanvas().onmouseup = function(){
    mousedown = false;
    imageSelected = false;
}

myCanvas.getCanvas().onkeydown = function(event){
    var key = event.keyCode;
    
    if(key==32){
        console.log('key: ',key);  
        var layers = myCanvas.getLayers();
        layers[0].setZIndex(1);
        layers[1].setZIndex(0);
        myCanvas.renderLayers();
    }else{  //a
        
        
        var picture = myCanvas.getLayers()[0].getPicture();
        var image = picture.getImage();
        var dimen = picture.getDimension();
        var width = dimen.width;
        var height = dimen.height;
        var position = picture.getPosition();
        var posX = position.posX;
        var posY = position.posY;
        
        if(key==65){
            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
            ctx.drawImage(image, posX, posY, width*0.5, height*0.5);    
        }else if(key==66){
            ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
            ctx.drawImage(image, posX, posY, width*2, height*2);
        }
        
    }
}


var zoomLevel = 1;
myCanvas.getCanvas().onmousewheel = function(event){
    
    var deltaYVlaue = event.deltaY;
    console.log(deltaYVlaue)
    
    var picture = myCanvas.getLayers()[0].getPicture();
    var image = picture.getImage();
    var dimen = picture.getDimension();
    var width = dimen.width;
    var height = dimen.height;
    var position = picture.getPosition();
    var posX = position.posX;
    var posY = position.posY;
    ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
    
    
    if(deltaYVlaue>0){
        zoomLevel/=1.1;
    }else{
        zoomLevel*=1.1;
        
    }
    ctx.drawImage(image, posX, posY, width*zoomLevel, height*zoomLevel); 
}