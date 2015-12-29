var LayerBarUI = (function(){
	function LayerBarUI(){
		var parentElement;
		var initial;
		var listElements = [];
		

		/*
			*Initializes the Layer bar UI
		*/
		this.init = function(){
			console.log('layerbar init');

			var layerAction = document.getElementsByClassName('layer-action')[0];
			var deleteWrapper = document.createElement('div');
			var deleteLayer = document.createElement('input');
			deleteLayer.setAttribute('type','button');
			deleteLayer.setAttribute('id','layer-delete');
			deleteLayer.setAttribute('class','layer-action-button');

			deleteLayer.onclick = function(e){
				var layers = PhotoEditor.getInstance().getLayers();
			    var activeZIndex = PhotoEditor.getInstance().getActiveLayerIndex();
			    for (var i = layers.length - 1; i >= 0; i--) {
			        if(layers[i].getZIndex()==activeZIndex){
			            layers.splice(i, 1);
			            PhotoEditorUI.getInstance().renderLayers();
			            break;
			        }
			    };
			}

			deleteWrapper.appendChild(deleteLayer);
			layerAction.appendChild(deleteWrapper);
		}


		/*this method is called when there is any activity in canvas*/
		this.update = function(){
			var opBar = document.getElementById('opacity-bar');
			var ul = document.getElementById('layer-list');
			
		    var layers = PhotoEditor.getInstance().getLayers();

		    //clear opacity bar
			while (opBar.firstChild) {
	            opBar.removeChild(opBar.firstChild);
	        }

	        //clear layer list
			while (ul.firstChild) {
	            ul.removeChild(ul.firstChild);
	        }

	        var activeLayerZIndex = PhotoEditor.getInstance().getActiveLayerIndex();
	        var layer = PhotoEditor.getInstance().getActiveLayer(activeLayerZIndex);

	        if(layer){
	        	var opLabel = document.createElement('label');
		        opLabel.innerHTML = 'opacity';
		        var opacitySlider = document.createElement('input');
		        opacitySlider.setAttribute('type','range');
		        opacitySlider.setAttribute('min','0');
		        opacitySlider.setAttribute('max','255');
		        opacitySlider.setAttribute('value',layer.getOpacity());
		        opBar.appendChild(opLabel);
		        opBar.appendChild(opacitySlider);
		        opacitySlider.addEventListener('change',opOnChange, false);
	        }


	        layers.sort(function(a,b){
	            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
		    });

		    listElements = [];

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
		        li.addEventListener('dblclick',handleDblClick, false);
		        

		        li.onclick = (function(list){
		        	return function(){
		        		list.increaseTotalClicks();

		        		if(list.getTotalClicks() == 1){
		        			setTimeout(function(){
		        				var l = list.getListElement();
		        				
		        				if(list.getTotalClicks() == 1 && !list.isDoubleClick()){
		        					l.style.background = '#2B2E3C';
					        		for(var i in listElements){
					        			if(listElements[i] != list){
					        				listElements[i].getListElement().style.background = 'none';
					        			}
					        		}

					        		var zIndex = list.getZIndex();

					        		//firing custom event and attaching z-index value of selected layer
					        		var ev1 = new CustomEvent('layerSelectInList',{'detail':zIndex});

								    PhotoEditor.getInstance().setActiveLayerIndex(zIndex);
								    
								    var ulist = document.getElementsByTagName('ul');
								    for(var i=0; i<ulist.length; i++){
								        ulist[i].dispatchEvent(ev1);
								    }

								    var l = document.getElementsByTagName('li');
								    for(var i=0; i<l.length; i++){
								        l[i].dispatchEvent(ev1);
								    }

								    var c = document.getElementsByTagName('canvas')[0];
								    c.dispatchEvent(ev1);

			        			}else{
			      
			        			}

		        				list.resetTotalClicks();
		        			},300);
		        		}
		        	};
		        })(list);


		        li.onkeydown = (function(list){
		        	return function(){
		        		var key = parseInt(event.keyCode);
		        		//rename layer
						if(key==13){
							event.preventDefault();
							var newName = this.textContent || this.innerText;
							var zIndex = list.getZIndex();
					        PhotoEditor.getInstance().setActiveLayerIndex(zIndex);
					        var lyr = PhotoEditor.getInstance().getActiveLayer();

					        lyr.setName(newName);
							this.contentEditable = 'false';
							list.disableDoubleClick();
						}
		        	}
		        }(list));


		        if(layers[i].getZIndex() == activeLayerZIndex){
		        	li.style.background = '#2B2E3C';
		        }

				ul.appendChild(li);
				listElements.push(list);
			}	
		}


		/*
			*sets parent element for LayerBarUI
			@params {Element} pEl
		*/
		this.setParent = function(pEl){
			parentElement = pEl;
		}


		//handles the changed opacity value
		function opOnChange(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var opValue = parseInt(this.value);
			layer.setOpacity(opValue);
			PhotoEditorUI.getInstance().renderLayers();
		}


		//handle the event when a layer is selected in canvas
		function handleLayerSelectInCanvas(e){
			var zIndex = parseInt(e.detail);
			for(var i in listElements){
				if(listElements[i].getZIndex() == zIndex){
					var li = listElements[i].getListElement();
					li.style.background = '#2B2E3C';
				}
			}
		}


		//handle double click event
		function handleDblClick(){
			this.contentEditable = 'true';
			// console.log('hello dbl click');
		}



		//handles drag start event
		function handleDragStart(ev1){
			var list = parentElement.getElementsByTagName('li');
			//identify which list is clicked and set the initial value
		    for (var i = list.length - 1; i >= 0; i--) {
		        if(this==list[i]){
		            initial = i;
		            break;
		        }
		    };
		}


		//handles the event when a list element is over another list element while dragging
		function handleDragOver(e){
		    if(e.preventDefault){
		        e.preventDefault();
		    }

		    e.dataTransfer.dropEffect = 'move'; 
		    return false;
		}


		//handles the event when a list element enters another list element while dragging
		function handleDragEnter(e) {
		  	this.classList.add('over');
		}


		//handles the event when a list element leaves another list element while dragging
		function handleDragLeave(e) {
		  	this.classList.remove('over');
		}


		//handles the event when a list element is dropped
		function handleDrop(e) {
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}

			var finalValue;
			var list = parentElement.getElementsByTagName('li');
			//identify the index of list element when it is dropped
			for (var i = list.length - 1; i >= 0; i--) {
				if(this==list[i]){
					finalValue = i;
				}
			}

	  		moveLayer(initial, finalValue);
			return false;
		}


		function handleDragEnd(e) {
		  [].forEach.call(list, function (l) {
		    l.classList.remove('over');
		  });
		}


		/*adjust the zindex of Layer Objects when the drag event is finished*/
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
		        for(var i=start-1; i>=end; i--){
		            var temp = layers[start].getZIndex();
		            layers[start].setZIndex(layers[i].getZIndex());
		            layers[i].setZIndex(temp);
		        }
		    }
		    
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