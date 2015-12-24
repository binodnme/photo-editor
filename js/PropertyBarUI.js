var PropertyBarUI = (function(){
	function PropertyBarUI(){
		var parentElement;

		this.init = function(){
			console.log('property bar init');
			
			var list1 = document.createElement('li');

			var widthLabel = document.createElement('Label');
			widthLabel.innerHTML = 'width';
			var widhtInput = document.createElement('input');
			widhtInput.setAttribute('id', 'prop-width');
			widhtInput.setAttribute('class', 'prop-input');
			widhtInput.addEventListener('change', handlerWidthChange, false);
			

			list1.appendChild(widthLabel);
			list1.appendChild(widhtInput);

			var list2 = document.createElement('li');
			var heightLabel = document.createElement('label');
			heightLabel.innerHTML = 'height';
			var heightInput = document.createElement('input');
			heightInput.setAttribute('id', 'prop-height');
			heightInput.setAttribute('class', 'prop-input');
			heightInput.addEventListener('change', handlerHeightChange, false);


			list2.appendChild(heightLabel);
			list2.appendChild(heightInput);

			parentElement.appendChild(list1);
			parentElement.appendChild(list2);
		}

		this.setParent = function(pEl){
			parentElement = pEl;
			parentElement.addEventListener('layerSelectInCanvas', handlerLayerSelectInCanvas, false);
			parentElement.addEventListener('layerSelectInList', handlerLayerSelectInCanvas, false);
		}
	}

	function handlerWidthChange(e){
		var value = parseFloat(this.value);
		console.info('value:', value);
		if(value>0){
			// var photoEditor = PhotoEditor.getInstance();
			// var zIndex = photoEditor.getActiveLayerIndex();
			// var layer = photoEditor.getLayerByZIndex(zIndex);
			var layer = PhotoEditor.getInstance().getActiveLayer();
			console.info('layer: ', layer);
			var pic = layer.getPicture();
			var dimen = pic.getDimension();
            var pos = pic.getPosition();

            var canvas = document.createElement('canvas');
            canvas.width = value;
            canvas.height = dimen.height;

            var context = canvas.getContext('2d');

            context.drawImage(pic.getImage(), 0, 0, canvas.width, canvas.height);

            var src  = canvas.toDataURL('image/png');
            pic.setImageSrc(src);
            canvas.remove();

			PhotoEditorUI.getInstance().renderLayers();
		}
	}

	function handlerHeightChange(e){
		var value = parseFloat(this.value);
		console.info('value:', value);
		if(value>0){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			console.info('layer: ', layer);
			var pic = layer.getPicture();
			var dimen = pic.getDimension();
            var pos = pic.getPosition();

            var canvas = document.createElement('canvas');
            canvas.width = dimen.width;
            canvas.height = value;

            var context = canvas.getContext('2d');

            context.drawImage(pic.getImage(), 0, 0, canvas.width, canvas.height);

            var src  = canvas.toDataURL('image/png');
            pic.setImageSrc(src);
            canvas.remove();

			PhotoEditorUI.getInstance().renderLayers();
		}
	}

	function handlerLayerSelectInCanvas(e){
	    var zIndex = parseInt(e.detail);

	    var layers = PhotoEditor.getInstance().getLayers();
	    var widthBox = document.getElementById('prop-width');
	    var heightBox = document.getElementById('prop-height');

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

    	
    	var filterList = document.getElementById('filter-list');
	    if(layerIndex){
	        var filters = layers[layerIndex].getFilters();
	        while (filterList.firstChild) {
	            filterList.removeChild(filterList.firstChild);
	        }

	        var value = 0;
	        for(var i in filters){
	            var list = document.createElement('li');
	            var para = document.createElement('p');
	            
	            para.innerHTML = filters[i].name;
	            list.appendChild(para);

	            var input = document.createElement('input');
	            if(filters[i].min){
	            	
	            	input.setAttribute('id', value++)
	            	input.setAttribute('type', 'range');
	            	input.setAttribute('min', filters[i].min);
		            input.setAttribute('max', filters[i].max);
		            input.setAttribute('value', filters[i].getArgs());

		            input.onchange = (function(filter){
		                return function(){
		                	// console.log('this this this: ',filter.name);
		                 //    console.info('value:', this.value);
		                    filter.setArgs(parseInt(this.value));
		                    PhotoEditorUI.getInstance().renderLayers();
		                }
		            })(filters[i]);
	            	
	            	list.appendChild(input);
	            }


	            var checkbox = document.createElement('input');
	            checkbox.setAttribute('type', 'checkbox');
	            checkbox.setAttribute('name', filters[i].name);
	            checkbox.checked = filters[i].isActive();

	            
	            checkbox.onchange = (function(filter){
	            		return function(){
		                    if(this.checked){
		                    	filter.enable();
		                    	console.info('chekcbox clajds:',this.getAttribute('name'));
		                    }else{
		                    	filter.disable();
		                    }
		                    PhotoEditorUI.getInstance().renderLayers();
		                }
		        })(filters[i]);
	            
	            list.appendChild(checkbox);
	            
	            filterList.appendChild(list);
	        }
	    }
	}


	var instance;
	return {
		getInstance: function(){
			if(instance==null){
				instance = new PropertyBarUI();
				instance.constructor = null;
			}

			return instance;
		}
	}
}());
