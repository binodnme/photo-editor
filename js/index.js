console.log('start');


var pUI = PhotoshopUI.getInstance();

pUI.init();




var inputFileElmnt = document.getElementById('choose-file');
var getButton = document.getElementById('getButton');

// function setup(){
//     var  width = parseFloat(document.getElementById('width').value);
//     var  height = parseFloat(document.getElementById('height').value);

//     console.log('width:', width, ' height:', height);

//     myCanvas.getCanvas().width = width;
//     myCanvas.getCanvas().height = height;

//     myCanvas.renderLayers();
// }

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


// getButton.onclick = function(){
//     var url = document.getElementById('url');
    
//     if(url.value){
//         loadImage(url.value);
//     }else{
//         console.log('blank');
//     }
// }


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






// var propertyList = document.getElementById('property-list');

// propertyList.addEventListener('layerSelectInCanvas', function(ev1){
//     var zIndex = parseInt(ev1.detail);
//     var layers = myCanvas.getLayers();
//     var widthBox = document.getElementById('prop-width');
//     var heightBox = document.getElementById('prop-height');

//     var filterList = document.getElementById('filter-list');

//     var layerIndex;
//     for(var i in layers){
//         if(layers[i].getZIndex()==zIndex){
//             var dimen = layers[i].getPicture().getDimension();
//             widthBox.value = dimen.width;
//             heightBox.value = dimen.height;
//             layerIndex = i;
//             break;
//         }
//     }

//     if(layerIndex){
//         var filters = layers[layerIndex].getFilters();
//         while (filterList.firstChild) {
//             filterList.removeChild(filterList.firstChild);
//         }
//         var value = 0;
//         for(var i in filters){
//             var list = document.createElement('li');
//             var para = document.createElement('p');
//             var input = document.createElement('input');
//             para.innerHTML = filters[i].name;
//             input.setAttribute('id', value++)
//             input.setAttribute('type', 'range');
//             input.setAttribute('min', filters[i].min);
//             input.setAttribute('max', filters[i].max);


//             input.onchange = (function(){
//                 return function(){
//                     console.info('value:', this.value);
//                     filters[i].setArgs(parseInt(this.value));
//                     myCanvas.renderLayers();
//                 }
//             })();

            
//             list.appendChild(para);
//             list.appendChild(input);
            
//             filterList.appendChild(list);
//         }
//     }
// });






// function grayscale(){
//     var zIndex = myCanvas.getActiveLayerIndex();
//     if(zIndex>=0){
//         var layer = myCanvas.getLayerByZIndex(zIndex);
//         // var layer = myCanvas.getLayers()[layerIndex];
//         var g = new Grayscale();
//         layer.getFilters().push(g);
//         myCanvas.renderLayers();
//     }
// }

// function brightness(){
//     var zIndex = myCanvas.getActiveLayerIndex();
//     if(zIndex>=0){
//         var layer = myCanvas.getLayerByZIndex(zIndex);
//         // var layer = myCanvas.getLayers()[layerIndex];
//         var b = new Brightness();
//         b.setArgs(50);
//         layer.getFilters().push(b);
//         myCanvas.renderLayers();
//     }
// }

// function threshold(){
//     var zIndex = myCanvas.getActiveLayerIndex();
//     if(zIndex>=0){
//         var layer = myCanvas.getLayerByZIndex(zIndex);
//         // var layer = myCanvas.getLayers()[layerIndex];
//         var t = new Threshold();
//         t.setArgs(100);
//         layer.getFilters().push(t); 
//         myCanvas.renderLayers();
//     }
// }

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


// var selectTool = true;
// var transformTool = false;


// function changeTool(val){
//     if(val==1){
//         selectTool = true;
//         transformTool = false;
//     }else if(val==2){
//         selectTool=false;
//         transformTool = true;
//     }
// }


// var download = document.getElementById('download');
// download.addEventListener('click', function(ev1){
//     console.info('downloaded');
//     var canvas = myCanvas.getCanvas();
//     ctx.clearRect(0,0,canvas.width, canvas.height);
//     myCanvas.renderLayers();

//     downloadCanvas(this,'playground','test.png');
// }, false);


// function downloadCanvas(link, canvasId, filename) {
//     link.href = document.getElementById(canvasId).toDataURL();
//     link.download = filename;
// }