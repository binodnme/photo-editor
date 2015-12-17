console.log('start');


var pUI = PhotoshopUI.getInstance();

pUI.init();




var inputFileElmnt = document.getElementById('choose-file');
var getButton = document.getElementById('getButton');

function setup(){
    var  width = parseFloat(document.getElementById('width').value);
    var  height = parseFloat(document.getElementById('height').value);

    console.log('width:', width, ' height:', height);

    PhotoshopUI.getInstance().getCanvas().setDimension(width, height);

    PhotoshopUI.getInstance().renderLayers();
}

// function createCanvas(w, h){
//     var width = 500;
//     var height = 300;

//     if(w && h){
//         width = w;
//         height = h;
//     }

//     var canvas = document.createElement('canvas');
//     canvas.width = width;
//     canvas.height = height;
//     canvas.setAttribute('tabindex', '1');

//     var canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];

//     while (canvasWrapper.firstChild) {
//         canvasWrapper.removeChild(canvasWrapper.firstChild);
//     }

//     canvasWrapper.appendChild(canvas);

//     return canvas;
// }


inputFileElmnt.onchange = function(event){
    var file = event.target.files[0];
    var fileReader = new FileReader();
    
    fileReader.onload = function(event1){
        loadImage(event1.target.result);
    }
    fileReader.readAsDataURL(file);
}


getButton.onclick = function(){
    var url = document.getElementById('url');
    
    if(url.value){
        loadImage(url.value);
    }else{
        console.log('blank');
    }
}


function loadImage(src){
    var img = new Image();
    img.src = src;

    var picture = new Picture();
    picture.setImage(img);

    var layer = new Layer();
    layer.setPicture(picture);
 
    // myCanvas.addLayer(layer);
    var main = Photoshop.getInstance();
    main.addLayer(layer);
   
    picture.getImage().onload = function(){
        picture.setDimension(picture.getImage().width, picture.getImage().height);
        pUI.renderLayers();
        // updateLayerUI(layer);
    }
}



function grayscale(){
    var zIndex = Photoshop.getInstance().getActiveLayerIndex();
    if(zIndex>=0){
        var layer = Photoshop.getInstance().getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var g = new Grayscale();
        layer.getFilters().push(g);
        PhotoshopUI.getInstance().renderLayers();
    }
}

function brightness(){
    var zIndex = Photoshop.getInstance().getActiveLayerIndex();
    if(zIndex>=0){
        var layer = Photoshop.getInstance().getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var b = new Brightness();
        b.setArgs(50);
        layer.getFilters().push(b);
        PhotoshopUI.getInstance().renderLayers();
    }
}

function threshold(){
    var zIndex = Photoshop.getInstance().getActiveLayerIndex();
    if(zIndex>=0){
        var layer = Photoshop.getInstance().getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var t = new Threshold();
        t.setArgs(100);
        layer.getFilters().push(t); 
        PhotoshopUI.getInstance().renderLayers();
    }
}

// function convolution(){
//     var zIndex = myCanvas.getActiveLayerIndex();
//     if(zIndex>=0){
//         var layer = myCanvas.getLayerByZIndex(zIndex);
//         // var layer = myCanvas.getLayers()[layerIndex];
//         var t = new Convolution();
//         t.setArgs(100);
//         layer.getFilters().push(t); 
//         myCanvas.renderLayers();
//     }   
// }



var download = document.getElementById('download');
download.addEventListener('click', function(ev1){
    console.info('downloaded');
    var canvas = PhotoshopUI.getInstance().getCanvas();
    canvas.getContext().clearRect(0,0,canvas.width, canvas.height);
    PhotoshopUI.getInstance().renderLayers();

    downloadCanvas(this,'playground','test.png');
}, false);


function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}