var LayerBarUI = (function(){
	function LayerBarUI(){
		var parentElement;
		var initial;
		var listElements = [];
		var singleClickTimeOut;

		this.init = function(){
			console.log('layerbar init');
		}

		this.update = function(){
			// var layerListWrapper = document.getElementsByClassName('layer-list-wrapper')[0];
			var opBar = document.getElementById('opacity-bar');
			var ul = document.getElementById('layer-list');
			
		    // layerListWrapper.removeChild(layerListWrapper.firstChild);
	        
			var layers = PhotoEditor.getInstance().getLayers();

			while (opBar.firstChild) {
	            opBar.removeChild(opBar.firstChild);
	        }


			while (ul.firstChild) {
	            ul.removeChild(ul.firstChild);
	        }

	        var activeLayerZIndex = PhotoEditor.getInstance().getActiveLayerIndex();
	        var layer = PhotoEditor.getInstance().getLayerByZIndex(activeLayerZIndex);

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
		        		singleClickTimeOut = setTimeout(function(){
		        			var l = list.getListElement();
		        			l.style.background = 'grey';

			        		for(var i in listElements){
			        			if(listElements[i] != list){
			        				listElements[i].getListElement().style.background = 'white';
			        			}
			        		}

			        		var zIndex = list.getZIndex();
			        		var ev1 = new CustomEvent('layerSelectInList',{'detail':zIndex});

						    PhotoEditor.getInstance().setActiveLayerIndex(zIndex);
						    
						    var ulist = document.getElementsByTagName('ul');
						    for(var i=0; i<ulist.length; i++){
						        ulist[i].dispatchEvent(ev1);
						    }

						    var c = document.getElementsByTagName('canvas')[0];
						    c.dispatchEvent(ev1);
		        		},400);
		        		
		        	};
		        })(list);

		        // var ipt = document.createElement('input');
		        // ipt.setAttribute('type','button')
		        // ipt.value = 'R';
		        // li.appendChild(ipt);

		        // ipt.onclick = (function(l){
		        // 	return function(){
		        // 		console.log('li:', l);
		        // 		l.contentEditable = 'true';
		        // 		console.log('li:', l);
		        // 	}
		        // })(li);

		        // li.ondblclick = (function(){
		        // 	return function(){
		        // 		console.info('this:', this);
		        // 		this.contentEditable = 'true';
		        // 	}
		        // })();


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
			            PhotoEditorUI.getInstance().renderLayers();
			            break;
			        }
			    };
			}
			ul.appendChild(input);
		}


		this.setParent = function(pEl){
			parentElement = pEl;
		}


		function opOnChange(){
			var zIndex = PhotoEditor.getInstance().getActiveLayerIndex();
			var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);
			var opValue = parseInt(this.value);
			layer.setOpacity(opValue);
			var pic = layer.getPicture();

			var mainFilter = new Filter();
			var pixels = mainFilter.getPixels(pic);
			
			for (var i = pixels.data.length - 1; i >= 0; i-=4) {
				pixels.data[i]=opValue;
			};

			
			var cnvs = document.createElement('canvas');
			cnvs.width = pixels.width;
			cnvs.height = pixels.height;

			var ctx = cnvs.getContext('2d');
			ctx.putImageData(pixels, 0,0);

			var img = new Image();
			img.src = cnvs.toDataURL('image/png');

			pic.setImageSrc(img.src);

			PhotoEditorUI.getInstance().renderLayers();
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


		function handleDblClick(){
			clearTimeout(singleClickTimeOut);
			console.info('hello dbl click');
			this.contentEditable = 'true';
			console.info('this: ',this);
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
	  
			moveLayer(initial, finalValue);
			
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








		


		


		

		
		

		

		
		

		


		

		