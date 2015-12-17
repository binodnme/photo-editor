console.log('start');

var inputFileElmnt = document.getElementById('choose-file');
var getButton = document.getElementById('getButton');
var cnvs = document.getElementById('playground'); 

var myCanvas = new Canvas();
myCanvas.setCanvas(cnvs);
var ctx = myCanvas.getContext();


function setup(){
    var  width = parseFloat(document.getElementById('width').value);
    var  height = parseFloat(document.getElementById('height').value);

    console.log('width:', width, ' height:', height);

    myCanvas.getCanvas().width = width;
    myCanvas.getCanvas().height = height;

    myCanvas.renderLayers();
}

function createCanvas(w, h){
    var width = 500;
    var height = 300;

    if(w && h){
        width = w;
        height = h;
    }

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute('tabindex', '1');

    var canvasWrapper = document.getElementsByClassName('canvas-wrapper')[0];

    while (canvasWrapper.firstChild) {
        canvasWrapper.removeChild(canvasWrapper.firstChild);
    }

    canvasWrapper.appendChild(canvas);

    return canvas;
}


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
 
    myCanvas.addLayer(layer);
   
    picture.getImage().onload = function(){
        picture.setDimension(picture.getImage().width, picture.getImage().height);
        myCanvas.renderLayers();
        updateLayerUI(layer);
    }
}



var layerList = document.getElementById('layer-list');

function deleteLayer(){
    var layers = myCanvas.getLayers();
    var activeZIndex = myCanvas.getActiveLayerIndex();
    console.info('active: ', activeZIndex);
    for (var i = layers.length - 1; i >= 0; i--) {
        if(layers[i].getZIndex()==activeZIndex){
            layers.splice(i, 1);
            updateLayerUI();
            updatePropertyList();
            myCanvas.renderLayers();
            activeZIndex = undefined;
            break;
        }
    };
}


function layerSelection(zIndex){
    var ev1 = new CustomEvent('layerSelectInList',{'detail':zIndex});

    myCanvas.setActiveLayerIndex(zIndex);
    updateLayerUI();
    
    var ulist = document.getElementsByTagName('ul');

    for(var i=0; i<ulist.length; i++){
        ulist[i].dispatchEvent(ev1);
    }

    var c = document.getElementsByTagName('canvas')[0];
    c.dispatchEvent(ev1);

}





layerList.addEventListener('layerSelectInCanvas', function(ev1){
    var zIndex = parseInt(ev1.detail);
    var layers = myCanvas.getLayers();
    myCanvas.setActiveLayerIndex(zIndex);

    var children = layerList.children;

    for(var i=0; i<children.length; i++){
        if(parseInt(children[i].getAttribute('id'))== zIndex){
            children[i].style.background = 'grey';
        }else{
            children[i].style.background = 'white';
        }
    }
});




var propertyList = document.getElementById('property-list');

propertyList.addEventListener('layerSelectInCanvas', function(ev1){
    var zIndex = parseInt(ev1.detail);
    var layers = myCanvas.getLayers();
    var widthBox = document.getElementById('prop-width');
    var heightBox = document.getElementById('prop-height');

    var filterList = document.getElementById('filter-list');

    var layerIndex;
    for(var i in layers){
        if(layers[i].getZIndex()==zIndex){
            var dimen = layers[i].getPicture().getDimension();
            widthBox.value = dimen.width;
            heightBox.value = dimen.height;
            layerIndex = i;
            break;
        }
    }

    if(layerIndex){
        var filters = layers[layerIndex].getFilters();
        while (filterList.firstChild) {
            filterList.removeChild(filterList.firstChild);
        }
        var value = 0;
        for(var i in filters){
            var list = document.createElement('li');
            var para = document.createElement('p');
            var input = document.createElement('input');
            para.innerHTML = filters[i].name;
            input.setAttribute('id', value++)
            input.setAttribute('type', 'range');
            input.setAttribute('min', filters[i].min);
            input.setAttribute('max', filters[i].max);


            input.onchange = (function(){
                return function(){
                    console.info('value:', this.value);
                    filters[i].setArgs(parseInt(this.value));
                    myCanvas.renderLayers();
                }
            })();

            
            list.appendChild(para);
            list.appendChild(input);
            
            filterList.appendChild(list);
        }
    }
});





// function adjustParameter(ev1){
//     var filterList = document.getElementById('filter-list');

//     var list = filterList.getElementsByTagName('input');
//     for (var i = list.length - 1; i >= 0; i--) {
//         if(this==list[i]){
            
//         }
//     };
// }


propertyList.addEventListener('layerSelectInList', function(ev2){
    updatePropertyList(ev2);
});


function updatePropertyList(evnt){
    var widthBox = document.getElementById('prop-width');
    var heightBox = document.getElementById('prop-height');

    if(evnt){
        var ev1 = evnt;
        var zIndex = parseInt(ev1.detail);
        var layers = myCanvas.getLayers();

        for(var i in layers){
            if(layers[i].getZIndex()==zIndex){
                var dimen = layers[i].getPicture().getDimension();
                widthBox.value = dimen.width;
                heightBox.value = dimen.height;
                break;
            }
        }
    }else{
        widthBox.value = '';
        heightBox.value = '';
    }
}


var propWidth = document.getElementById('prop-width');
var propHeight = document.getElementById('prop-height');

propWidth.onchange = function(eChange){
    var zIndex = myCanvas.getActiveLayerIndex();
    var layer = myCanvas.getLayerByZIndex(zIndex);
    // var layer = myCanvas.getLayers()[myCanvas.getActiveLayerIndex()];
    resize(eChange, layer);
}

propHeight.onchange = function(event){
    var zIndex = myCanvas.getActiveLayerIndex();
    var layer = myCanvas.getLayerByZIndex(zIndex);
    // var layer = myCanvas.getLayers()[myCanvas.getActiveLayerIndex()];
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




function grayscale(){
    var zIndex = myCanvas.getActiveLayerIndex();
    if(zIndex>=0){
        var layer = myCanvas.getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var g = new Grayscale();
        layer.getFilters().push(g);
        myCanvas.renderLayers();
    }
}

function brightness(){
    var zIndex = myCanvas.getActiveLayerIndex();
    if(zIndex>=0){
        var layer = myCanvas.getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var b = new Brightness();
        b.setArgs(50);
        layer.getFilters().push(b);
        myCanvas.renderLayers();
    }
}

function threshold(){
    var zIndex = myCanvas.getActiveLayerIndex();
    if(zIndex>=0){
        var layer = myCanvas.getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var t = new Threshold();
        t.setArgs(100);
        layer.getFilters().push(t); 
        myCanvas.renderLayers();
    }
}

function convolution(){
    var zIndex = myCanvas.getActiveLayerIndex();
    if(zIndex>=0){
        var layer = myCanvas.getLayerByZIndex(zIndex);
        // var layer = myCanvas.getLayers()[layerIndex];
        var t = new Convolution();
        t.setArgs(100);
        layer.getFilters().push(t); 
        myCanvas.renderLayers();
    }   
}


var selectTool = true;
var transformTool = false;


function changeTool(val){
    if(val==1){
        selectTool = true;
        transformTool = false;
    }else if(val==2){
        selectTool=false;
        transformTool = true;
    }
}


var download = document.getElementById('download');
download.addEventListener('click', function(ev1){
    console.info('downloaded');
    var canvas = myCanvas.getCanvas();
    ctx.clearRect(0,0,canvas.width, canvas.height);
    myCanvas.renderLayers();

    downloadCanvas(this,'playground','test.png');
}, false);


function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}