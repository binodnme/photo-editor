var PropertyBarUI = (function(){
	function PropertyBarUI(){
		var parentElement;


		/*
			*Initializes Property Bar
		*/
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


		/*
			*set parent element for property bar
			@params {Element} pEl
		*/
		this.setParent = function(pEl){
			parentElement = pEl;
			parentElement.addEventListener('layerSelectInCanvas', handlerLayerSelectInCanvas, false);
			parentElement.addEventListener('layerSelectInList', handlerLayerSelectInCanvas, false);
		}
	}


	function handlerWidthChange(e){
		var value = parseFloat(this.value);
		if(value>0){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var pic = layer.getPicture();
			var dimen = pic.getDimension();
            pic.setDimension(value, dimen.height);
			PhotoEditorUI.getInstance().renderLayers();
		}
	}

	
	function handlerHeightChange(e){
		var value = parseFloat(this.value);
		if(value>0){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var pic = layer.getPicture();
			var dimen = pic.getDimension();
            pic.setDimension(dimen.width, value);
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
	}


	//this approach is used to make the class Singleton
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
