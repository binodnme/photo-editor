var LayerBarUI = (function(){
	function LayerBarUI(){
		var parentElement;
		var initial;
		var listElements = [];
		var singleClickTimeOut;

		this.init = function(){
			console.log('layerbar init');


			var layerAction = document.getElementsByClassName('layer-action')[0];

			var deleteWrapper = document.createElement('div');
			var deleteLayer = document.createElement('input');
			deleteLayer.setAttribute('type','button');
			// deleteLayer.setAttribute('value', 'delete');
			deleteLayer.setAttribute('id','layer-delete');
			deleteLayer.setAttribute('class','layer-action-button');


			deleteLayer.onclick = function(e){
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

			deleteWrapper.appendChild(deleteLayer);
			layerAction.appendChild(deleteWrapper);
		}

		this.update = function(){
			var opBar = document.getElementById('opacity-bar');
			var ul = document.getElementById('layer-list');
			
		    var layers = PhotoEditor.getInstance().getLayers();

			while (opBar.firstChild) {
	            opBar.removeChild(opBar.firstChild);
	        }


			while (ul.firstChild) {
	            ul.removeChild(ul.firstChild);
	        }

	        var activeLayerZIndex = PhotoEditor.getInstance().getActiveLayerIndex();
	        var layer = PhotoEditor.getInstance().getLayerByZIndex(activeLayerZIndex);

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
		        					console.info('single click');

		        					
				        			l.style.background = '#2B2E3C';
					        		for(var i in listElements){
					        			if(listElements[i] != list){
					        				listElements[i].getListElement().style.background = 'none';
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

			        			}else{
			        				// console.info('hello dbl click');
									this.contentEditable = 'true';
									this.focus();

									
			        			}

		        				list.resetTotalClicks();
		        			},300);
		        		}
		        	};
		        })(list);


		        li.onkeydown = (function(list){
		        	return function(){
		        		var key = parseInt(event.keyCode);
						// console.log(key);
						if(key==13){
							event.preventDefault();
							console.log("done")
							var newName = this.textContent || this.innerText;
							var zIndex = list.getZIndex();
					        PhotoEditor.getInstance().setActiveLayerIndex(zIndex);
					        var lyr = PhotoEditor.getInstance().getActiveLayer();

					        lyr.setName(newName);
							this.contentEditable = 'false';
							list.disableDoubleClick();
						}

						console.log(this.textContent || this.innerText);
		        	}
		        }(list));


		        // var cb = document.createElement('input');
		        // cb.setAttribute('type','checkbox');
		        // li.appendChild(cb);


		        if(layers[i].getZIndex() == activeLayerZIndex){
		        	li.style.background = '#2B2E3C';
		        }

				ul.appendChild(li);
				listElements.push(list);
			}	
		}


		this.setParent = function(pEl){
			parentElement = pEl;
		}


		function opOnChange(){
			
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var opValue = parseInt(this.value);
			layer.setOpacity(opValue);

			var pic = layer.getPicture();

			var mainFilter = new Filter();
			var pixels = mainFilter.getPixels(pic);
			console.info('hi pixesl');

			console.info('r:',pixels.data[0],'g:',pixels.data[1],'b:',pixels.data[2],'a:',pixels.data[3]);

			for (var i = pixels.data.length - 1; i >= 0; i-=4) {
				pixels.data[i]=opValue;
			};
			// console.info('opacity', opValue);

			console.info('r:',pixels.data[0],'g:',pixels.data[1],'b:',pixels.data[2],'a:',pixels.data[3]);
			
			// var cnvs = document.createElement('canvas');
			var cnvs = document.getElementById('testground');
			cnvs.width = pixels.width;
			cnvs.height = pixels.height;

			// cnvs.width = pic.getWidth();
			// cnvs.height = pic.getHeight();

			// console.info(cnvs.width, ', ', cnvs.height);

			var ctx = cnvs.getContext('2d');
			ctx.putImageData(pixels, 0,0);
			// ctx.globalAlpha = opValue/100;
			// console.info(pic.getImage());
			// ctx.drawImage(pic.getImage(),0,0);


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
					li.style.background = '#2B2E3C';
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








		


		


		

		
		

		

		
		

		


		

		