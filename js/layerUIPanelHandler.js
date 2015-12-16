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
    
    var activeLayerZIndex = myCanvas.getActiveLayerIndex(); 
    var children = layerList.children;

    for (var i = children.length - 1; i >= 0; i--) {
        var childrenId = parseInt(children[i].getAttribute('id'));
            if(!myCanvas.hasZIndex(childrenId)){
                children[i].remove();  
            }
    };
    
    for(var i=0; i<children.length; i++){
        if(parseInt(children[i].getAttribute('id'))== activeLayerZIndex){
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

    // for(var i in layers){
    //     console.info('index: ', layers[i].getZIndex());
    // }

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
