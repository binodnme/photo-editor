var LayerBarUI = (function(){
	function LayerBarUI(){
		var parentElement;
		var initial;
		var listElements = [];

		this.init = function(){
			console.log('layerbar init');
		}

		this.update = function(){
			var ul = document.getElementById('layer-list');

			var layers = PhotoEditor.getInstance().getLayers();

			while (ul.firstChild) {
	            ul.removeChild(ul.firstChild);
	        }

	        layers.sort(function(a,b){
	            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
		    });

		    listElements = [];

		    var activeLayerZIndex = PhotoEditor.getInstance().getActiveLayerIndex();

		    for(var i in layers){
			
				var list = new LayerListElement(layers[i].getZIndex());

				var li = list.getListElement();
				li.setAttribute('draggable', 'true')
				li.innerHTML = layers[i].getName();
				li.addEventListener('dragstart', handleDragStart, false);
		        li.addEventListener('dragenter', handleDragEnter, false);
		        li.addEventListener('dragover', handleDragOver, false);
		        li.addEventListener('dragleave', handleDragLeave, false);
		        li.addEventListener('drop', handleDrop, false);
		        li.addEventListener('layerSelectInCanvas', handleLayerSelectInCanvas, false);

		        li.onclick = (function(l){
		        	return function(){
		        		this.style.background = 'grey';

		        		for(var i in listElements){
		        			if(listElements[i] != l){
		        				listElements[i].getListElement().style.background = 'white';
		        			}
		        		}

		        		var zIndex = l.getZIndex();
		        		var ev1 = new CustomEvent('layerSelectInList',{'detail':zIndex});

					    PhotoEditor.getInstance().setActiveLayerIndex(zIndex);
					    
					    var ulist = document.getElementsByTagName('ul');
					    for(var i=0; i<ulist.length; i++){
					        ulist[i].dispatchEvent(ev1);
					    }

					    var c = document.getElementsByTagName('canvas')[0];
					    c.dispatchEvent(ev1);
		        	};
		        })(list);


		        if(layers[i].getZIndex() == activeLayerZIndex){
		        	li.style.background = 'grey';
		        }

				ul.appendChild(li);
				listElements.push(list);
			}	

			var input = document.createElement('input');
			input.setAttribute('type','button');
			input.setAttribute('value', 'delete');

			input.onclick = function(e){
				var layers = PhotoEditor.getInstance().getLayers();
			    var activeZIndex = PhotoEditor.getInstance().getActiveLayerIndex();
			    console.info('active: ', activeZIndex);
			    for (var i = layers.length - 1; i >= 0; i--) {
			        if(layers[i].getZIndex()==activeZIndex){
			            layers.splice(i, 1);
			            // updateLayerUI();
			            // updatePropertyList();
			            PhotoEditorUI.getInstance().renderLayers();
			            // activeZIndex = undefined;
			            break;
			        }
			    };
			}
			// console.info('input:', input);
			ul.appendChild(input);
		}

		this.setParent = function(pEl){
			parentElement = pEl;
		}

		function handleLayerSelectInCanvas(e){
			var zIndex = parseInt(e.detail);
			for(var i in listElements){
				if(listElements[i].getZIndex() == zIndex){
					var li = listElements[i].getListElement();
					li.style.background = 'grey';
				}
			}
		}

		function handleDragStart(ev1){
			// console.info('start');
		    var list = parentElement.getElementsByTagName('li');
		    for (var i = list.length - 1; i >= 0; i--) {
		        if(this==list[i]){
		            initial = i;
		            break;
		        }
		    };
		}

		function handleDragOver(e){
		    if(e.preventDefault){
		        e.preventDefault();
		    }

		    e.dataTransfer.dropEffect = 'move'; 
		    // console.info('over');
		    return false;
		}

		function handleDragEnter(e) {
		  	this.classList.add('over');
		  	// console.info('enter');
		}


		function handleDragLeave(e) {
		  	this.classList.remove('over');
		  	// console.info('leave');
		}

		function handleDrop(e) {
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}

			// console.info('drop');
			var finalValue;
			var list = parentElement.getElementsByTagName('li');
			for (var i = list.length - 1; i >= 0; i--) {
				if(this==list[i]){
					finalValue = i;
				}
			}
	  
			// console.info('initial:',initial, 'final:',finalValue);
			
			moveLayer(initial, finalValue);
			// if(initial < finalValue){
			// 	for(var i=initial; i<finalValue; i++){
			// 		var tempId = list[i].id;
			// 		var tempContent = list[i].innerHTML;

			// 		list[i].id=list[i+1].id;
			// 		list[i].innerHTML = list[i+1].innerHTML;

			// 		list[i+1].id = tempId;
			// 		list[i+1].innerHTML = tempContent;
			// 	}  
			// }else if(initial>finalValue){
			// 	for(var i=initial; i>finalValue; i--){
			// 		var tempId = list[i].id;
			// 		var tempContent = list[i].innerHTML;

			// 		list[i].id=list[i-1].id;
			// 		list[i].innerHTML = list[i-1].innerHTML;

			// 		list[i-1].id = tempId;
			// 		list[i-1].innerHTML = tempContent;
			// 	}
			// }
			
			return false;
		}

		function handleDragEnd(e) {
		  [].forEach.call(list, function (l) {
		    l.classList.remove('over');
		  });
		}


		function moveLayer(start, end){

		    var start = start;
		    var end = end;
		    var layers = PhotoEditor.getInstance().getLayers();

		    layers.sort(function(a,b){
		            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
		    });

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
		    
		    // updateLayerUI();
		    // updatePropertyList();
		    // myCanvas.renderLayers();
		    PhotoEditorUI.getInstance().renderLayers();
		}
	}

	var instance;

	return {
		getInstance: function(){
			if(instance==null){
				instance = new LayerBarUI();
				instance.constructor = null;
			}

			return instance;
		}
	}

})();








		


		


		

		
		

		

		
		

		


		

		