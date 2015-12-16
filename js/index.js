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

    // var cnvs = createCanvas(width, height);
    // myCanvas.setCanvas(cnvs);
    // ctx = myCanvas.getContext();
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


var mousedown = false;
var imageSelected = false;

myCanvas.getCanvas().onmousedown = function(e1){
    mousedown = true;
    
    var x = e1.pageX - myCanvas.getCanvas().offsetLeft;
    var y = e1.pageY - myCanvas.getCanvas().offsetTop;
    
    var index;
    
    var layers = myCanvas.getLayers();

    var indices = [];
    for(var i in layers){
        var dimen = layers[i].getPicture().getDimension();
        var pos = layers[i].getPicture().getPosition();
        if(x>=pos.posX && x<=(pos.posX+dimen.width) && y>=pos.posY && y<=(pos.posY+dimen.height)){
            imageSelected = true;
            indices.push(i);

            if(isOverOutline(x,y,pos,dimen)){
                console.log('i am in');
            }
        }    
    }

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

        var dimen = layers[hIndex].getPicture().getDimension();
        var pos = layers[hIndex].getPicture().getPosition();
        
        var xCor = pos.posX;
        var yCor = pos.posY;
        myCanvas.renderLayers();
        drawOutline({'posX':xCor, 'posY':yCor}, dimen);

        
        var ev1  = new CustomEvent('layerSelectInCanvas',{'detail':layers[hIndex].getZIndex()});
        var ulist = document.getElementsByTagName('ul');

        for(var j=0; j<ulist.length; j++){
            ulist[j].dispatchEvent(ev1);
        }

        var actualPos, xCorrection, yCorrection;
        actualPos = layers[hIndex].getPicture().getPosition();
    
        xCorrection = x-actualPos.posX;
        yCorrection = y-actualPos.posY;
        
        // myCanvas.getCanvas().onmousemove = function(e2){
        //     if(mousedown && imageSelected){
        //         var x1 = e2.pageX - myCanvas.getCanvas().offsetLeft;
        //         var y1 = e2.pageY - myCanvas.getCanvas().offsetTop;
        //         layers[hIndex].getPicture().setPosition(x1-xCorrection,y1-yCorrection);
        //         ctx.clearRect(0,0,myCanvas.getCanvas().width,myCanvas.getCanvas().height);
                
        //         myCanvas.renderLayers(); 
                
        //         var dimen = layers[hIndex].getPicture().getDimension();
        //         var finalX = x1-xCorrection;
        //         var finalY = y1-yCorrection;
                
        //         drawOutline({'posX':finalX, 'posY':finalY},dimen);   
        //     }
        // }
    }
}

// myCanvas.getCanvas().onmousemove = function(e2){
//     var x1 = e2.pageX - myCanvas.getCanvas().offsetLeft;
//     var y1 = e2.pageY - myCanvas.getCanvas().offsetTop;
    
//     var index = myCanvas.getActiveLayerIndex();

//     if(index>=0){
//         var layer = myCanvas.getLayers()[index];

//         var pos = layer.getPicture().getPosition();
//         var dimen = layer.getPicture().getDimension();

//         if(isOverOutline(x1,y1,pos,dimen)){
            
//             console.log('detected');
//             cnvs.style.cursor = 'ew-resize';

//         }else{
//             // console.info('no');
//             cnvs.style.cursor = 'default';
//         }

//     }
// }


myCanvas.getCanvas().onmouseup = function(){
    mousedown = false;
    imageSelected = false;
}


var layerList = document.getElementById('layer-list');
function updateLayerUI(layer){
    if(layer){
        var li = document.createElement('li');
        li.innerHTML = layer.getName();
        li.setAttribute('id', layer.getZIndex());
        li.setAttribute('onclick', 'layerSelection('+layer.getZIndex()+')');
        li.setAttribute('draggable', 'true')

        li.addEventListener('dragstart', handleDragStart, false);
        li.addEventListener('dragenter', handleDragEnter, false);
        li.addEventListener('dragover', handleDragOver, false);
        li.addEventListener('dragleave', handleDragLeave, false);
        li.addEventListener('drop', handleDrop, false);
        
        layerList.appendChild(li);
    }
    
    var activeLayerIndex = myCanvas.getActiveLayerIndex(); 
    var children = layerList.children;

    for (var i = children.length - 1; i >= 0; i--) {
        var childrenId = parseInt(children[i].getAttribute('id'));
            if(!myCanvas.hasZIndex(childrenId)){
                children[i].remove();  
            }
    };
    
    for(var i=0; i<children.length; i++){
        if(parseInt(children[i].getAttribute('id'))== activeLayerIndex){
            children[i].style.background = 'grey';
        }else{
            children[i].style.background = 'white';
        }
    }
}


function moveLayer(start, end){

    var start = start;
    var end = end;
    var layers = myCanvas.getLayers();

    layers.sort(function(a,b){
            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
    });

    for(var i in layers){
        console.info('index: ', layers[i].getZIndex());
    }

    if(start<end){
        for(var i=start+1; i<=end; i++){
            var temp = layers[start].getZIndex();
            layers[start].setZIndex(layers[i].getZIndex());
            layers[i].setZIndex(temp);
        }
    }else if(start>end){
        console.info('start>end');
        for(var i=start-1; i>=end; i--){
            var temp = layers[start].getZIndex();
            layers[start].setZIndex(layers[i].getZIndex());
            layers[i].setZIndex(temp);
        }
    }
    
    updateLayerUI();
    updatePropertyList();
    myCanvas.renderLayers();
}


function deleteLayer(){
    var layers = myCanvas.getLayers();
    var activeIndex = myCanvas.getActiveLayerIndex();
    console.info('active: ', activeIndex);
    for (var i = layers.length - 1; i >= 0; i--) {
        if(layers[i].getZIndex()==activeIndex){
            layers.splice(i, 1);
            updateLayerUI();
            updatePropertyList();
            myCanvas.renderLayers();
            activeIndex = undefined;
            break;
        }
    };
}


function layerSelection(index){
    var ev1 = new CustomEvent('layerSelectInList',{'detail':index});

    myCanvas.setActiveLayerIndex(index);
    updateLayerUI();
    
    var ulist = document.getElementsByTagName('ul');

    for(var i=0; i<ulist.length; i++){
        ulist[i].dispatchEvent(ev1);
    }

    var c = document.getElementsByTagName('canvas')[0];
    c.dispatchEvent(ev1);

}


myCanvas.getCanvas().addEventListener('layerSelectInList', function(ev){
    myCanvas.renderLayers();
    var index = parseInt(ev.detail);
    var layers = myCanvas.getLayers();
    for(var i=0; i<layers.length; i++){
        if(layers[i].getZIndex() == index){
            var pic = layers[i].getPicture();
            drawOutline(pic.getPosition(), pic.getDimension());
        }
    }
});


layerList.addEventListener('layerSelectInCanvas', function(ev1){
    var index = parseInt(ev1.detail);
    var layers = myCanvas.getLayers();
    myCanvas.setActiveLayerIndex(index);

    var children = layerList.children;

    for(var i=0; i<children.length; i++){
        if(parseInt(children[i].getAttribute('id'))== index){
            children[i].style.background = 'grey';
        }else{
            children[i].style.background = 'white';
        }
    }
});


var propertyList = document.getElementById('property-list');

propertyList.addEventListener('layerSelectInCanvas', function(ev1){
    var index = parseInt(ev1.detail);
    var layers = myCanvas.getLayers();
    var widthBox = document.getElementById('prop-width');
    var heightBox = document.getElementById('prop-height');

    var filterList = document.getElementById('filter-list');

    var layerIndex;
    for(var i in layers){
        if(layers[i].getZIndex()==index){
            // tempLayer = layers[i];
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
    
        for(var i in filters){
            var list = document.createElement('li');
            var para = document.createElement('p');
            var input = document.createElement('input');
            para.innerHTML = filters[i].name;
            input.setAttribute('type', 'range');
            input.setAttribute('min', filters[i].min);
            input.setAttribute('max', filters[i].max);

            input.addEventListener('change', function(ev2){
                // console.log('cangeshssdjlakjfdla');
                console.log('value',input.value);
                filters[i].setArgs(parseInt(input.value));
                myCanvas.renderLayers();

            });
            list.appendChild(para);
            list.appendChild(input);
            
            filterList.appendChild(list);
        }
    }

    
});


propertyList.addEventListener('layerSelectInList', function(ev2){
    updatePropertyList(ev2);
});


function updatePropertyList(evnt){
    var widthBox = document.getElementById('prop-width');
    var heightBox = document.getElementById('prop-height');

    if(evnt){
        var ev1 = evnt;
        var index = parseInt(ev1.detail);
        var layers = myCanvas.getLayers();

        for(var i in layers){
            if(layers[i].getZIndex()==index){
                // tempLayer = layers[i];
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
    var layer = myCanvas.getLayers()[myCanvas.getActiveLayerIndex()];
    resize(eChange, layer);
}

propHeight.onchange = function(event){
    var layer = myCanvas.getLayers()[myCanvas.getActiveLayerIndex()];
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


var dragSourceElement;
var initial;
function handleDragStart(ev1){

    var list = layerList.getElementsByTagName('li');
    for (var i = list.length - 1; i >= 0; i--) {
        if(this==list[i]){
            initial = i;
            break;
        }
    };
}


function handleDragOver(ev1){
    if(ev1.preventDefault){
        ev1.preventDefault();
    }

    ev1.dataTransfer.dropEffect = 'move'; 
    return false;
}


function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }


  var finalValue;
  var list = layerList.getElementsByTagName('li');
  for (var i = list.length - 1; i >= 0; i--) {
    if(this==list[i]){
      finalValue = i;
    }
  };
  
  console.info('initial:',initial, 'final:',finalValue);
  moveLayer(initial, finalValue);

  if(initial<finalValue){
    for(var i=initial; i<finalValue; i++){
        var tempId = list[i].id;
        var tempContent = list[i].innerHTML;
        
        list[i].id=list[i+1].id;
        list[i].innerHTML = list[i+1].innerHTML;

        list[i+1].id = tempId;
        list[i+1].innerHTML = tempContent;
    }  
  }else if(initial>finalValue){
        for(var i=initial; i>finalValue; i--){
        var tempId = list[i].id;
        var tempContent = list[i].innerHTML;
        
        list[i].id=list[i-1].id;
        list[i].innerHTML = list[i-1].innerHTML;

        list[i-1].id = tempId;
        list[i-1].innerHTML = tempContent;
    }
  }

  

  return false;
}

function handleDragEnd(e) {
  [].forEach.call(list, function (l) {
    l.classList.remove('over');
  });
}


function grayscale(){
    var layerIndex = myCanvas.getActiveLayerIndex();
    if(layerIndex>=0){
        var layer = myCanvas.getLayers()[layerIndex];
        var g = new Grayscale();
        layer.getFilters().push(g);
        myCanvas.renderLayers();
    }
}


function brightness(){
    var layerIndex = myCanvas.getActiveLayerIndex();
    if(layerIndex>=0){
        var layer = myCanvas.getLayers()[layerIndex];
        var b = new Brightness();
        b.setArgs(50);
        layer.getFilters().push(b);
        myCanvas.renderLayers();
    }
}

function threshold(){
    var layerIndex = myCanvas.getActiveLayerIndex();
    if(layerIndex>=0){
        var layer = myCanvas.getLayers()[layerIndex];
        var t = new Threshold();
        t.setArgs(100);
        layer.getFilters().push(t); 
        myCanvas.renderLayers();
    }
}

function convolution(){
    var layerIndex = myCanvas.getActiveLayerIndex();
    if(layerIndex>=0){
        var layer = myCanvas.getLayers()[layerIndex];
        var t = new Convolution();
        t.setArgs(100);
        layer.getFilters().push(t); 
        myCanvas.renderLayers();
    }   
}