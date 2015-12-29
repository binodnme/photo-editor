var FitlerBarUI = (function(){
	function FitlerBarUI(){

		var fadeOutTimer = null;

		
		/*
			*Initializes the filter bar UI
		*/
		this.init = function(){
			console.info('initializing fitler bar');
			var allFilters = document.getElementById('all-filters');

			
			//ul to hold all the filters list
			var filterList = document.createElement('ul');
			
			//li element for grayscale
			var grayscale = document.createElement('li');
			grayscale.setAttribute('class', 'grayscale');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Grayscale';
			grayscale.appendChild(div);
			grayscale.appendChild(layerName);
			grayscale.addEventListener('click', handleClickOnGrayscale, false);
			addlayerSelectInCanvasHandler(grayscale, 'grayscale');

			//li element for brightness
			var brightness = document.createElement('li');
			brightness.setAttribute('class', 'brightness');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Brightness';
			brightness.appendChild(div);
			brightness.appendChild(layerName)
			brightness.addEventListener('click', handleClickOnBrightness, false);
			addlayerSelectInCanvasHandler(brightness, 'brightness');			

			//li element for threshold
			var threshold = document.createElement('li');
			threshold.setAttribute('class', 'threshold');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Threshold';
			threshold.appendChild(div);
			threshold.appendChild(layerName);
			threshold.addEventListener('click', handleClickOnThreshold, false);
			addlayerSelectInCanvasHandler(threshold, 'threshold');

			//li element for sharpen
			var sharpen = document.createElement('li');
			sharpen.setAttribute('class', 'sharpen');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Sharpen';
			sharpen.appendChild(div);
			sharpen.appendChild(layerName);
			sharpen.addEventListener('click', handleClickOnSharpen, false);
			addlayerSelectInCanvasHandler(sharpen, 'sharpen');

			//li element for blur
			var blur = document.createElement('li');
			blur.setAttribute('class', 'blur');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Blur';
			blur.appendChild(div);
			blur.appendChild(layerName);
			blur.addEventListener('click', handleClickOnBlur, false);
			addlayerSelectInCanvasHandler(blur, 'blur');

			//li element for motionblur
			var motionBlur = document.createElement('li');
			motionBlur.setAttribute('class', 'motion-blur');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Motion Blur';
			motionBlur.appendChild(div);
			motionBlur.appendChild(layerName);
			motionBlur.addEventListener('click', handleClickOnMotionBlur, false);
			addlayerSelectInCanvasHandler(motionBlur, 'motionblur');
			

			filterList.appendChild(grayscale);
			filterList.appendChild(brightness);
			filterList.appendChild(threshold);
			filterList.appendChild(sharpen);
			filterList.appendChild(blur);
			filterList.appendChild(motionBlur);
			allFilters.appendChild(filterList);
		}



		/*
			*adds event listeners (layerSelectInList & layerSelectInCanvas) in input element
			@params {Element} element
			@params {String} filterName
		*/
		function addlayerSelectInCanvasHandler(element, filterName){
			element.addEventListener('layerSelectInList', layerSelectInCanvas, false);
			element.addEventListener('layerSelectInCanvas', layerSelectInCanvas, false);

			//handles the event when a layer is selected in canvas
			function layerSelectInCanvas(event){
				var zIndex = parseInt(event.detail);

				var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);
				var filters = layer.getFilters();

				var hasFilter = false;
				for(var i in filters){
					var filter = filters[i];
					if(filter.getName()==filterName){
						generateOverlay(element, filter, layer);
						hasFilter = true;
						break;
					}else{
						console.log('No. ', filterName);
					}
				}

				if(!hasFilter){
					var filterElement = element.getElementsByClassName('filter')[0];
					filterElement.style.borderTop = '2px solid transparent';
					var div = filterElement.getElementsByClassName('over-filter');

					if(div.length){
						div[0].remove();
					}
				}
			}
		}


		/*
			*Generates Overlay Div over the filters li element when the filter is selected
			@params {Element} element
			@params {Filter} filter
			@params {Layer} layer
		*/
		function generateOverlay(element, filter, layer){
			var filterElement = element.getElementsByClassName('filter')[0];
			filterElement.style.borderTop = '2px solid #D81010';

			//remove the over-filter
			var div = filterElement.getElementsByClassName('over-filter');
			if(div.length){
				div[0].remove();
			}

			var overFilter = document.createElement('div');
			overFilter.setAttribute('class', 'over-filter')

			var actionDiv = document.createElement('div');
			actionDiv.setAttribute('class', 'bottom-div');
			var actionLeft = document.createElement('div');
			actionLeft.setAttribute('class', 'bottom-left')
			
			var hide = document.createElement('div');
			hide.setAttribute('class', 'hide-div');

			if(filter.isActive()){
				hide.style.background = "url('./images/icons/hide_icon.png') no-repeat";
				hide.style.backgroundSize = 'cover';
			}else{
				hide.style.background = "url('./images/icons/show_icon.png') no-repeat";
				hide.style.backgroundSize = 'cover';	
			}
			actionLeft.appendChild(hide);


			var actionRight = document.createElement('div');
			actionRight.setAttribute('class', 'bottom-right')
			
			var remove = document.createElement('div');
			remove.setAttribute('class', 'remove-div');
			remove.style.background = "url('./images/icons/filter_delete.png') no-repeat";
			remove.style.backgroundSize = 'cover';
			actionRight.appendChild(remove);


			actionDiv.appendChild(actionLeft);
			actionDiv.appendChild(actionRight);


			hide.onclick = function(event){
				event.cancelBubble = true;
				if(filter.isActive()){
					layer.disableFilter(filter);
					this.style.background = "url('./images/icons/show_icon.png') no-repeat";
					this.style.backgroundSize = 'cover';
					removeSlider();
				}else{
					layer.enableFilter(filter);
					this.style.background = "url('./images/icons/hide_icon.png') no-repeat";
					this.style.backgroundSize = 'cover';
					generateSlider(layer, filter);
				}
				PhotoEditorUI.getInstance().renderLayers();
			}

			remove.onclick = function(event){
				event.cancelBubble = true;
				layer.removeFilter(filter);
				overFilter.remove();
				removeSlider();
				PhotoEditorUI.getInstance().renderLayers();
			}

			overFilter.onmouseover = function(){
				if(filter.isActive()){
					generateSlider(layer, filter);
				}
			}

			
			overFilter.appendChild(actionDiv);
			filterElement.appendChild(overFilter);
		}


		function handleClickOnGrayscale(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var filterFlag = false;

			if(layer){
				var filters = layer.getFilters();
				for(var i in filters){
					if(filters[i].getName()=='grayscale'){
						filterFlag = true;
						generateSlider(layer, filters[i]);
						break;
					}
				}

				if(!filterFlag){
					var f = new Grayscale();
					layer.addFilter(f);
			        generateSlider(layer, f);
			        generateOverlay(this, f, layer);
				}
			}	
		}


		function handleClickOnBrightness(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var filterFlag = false;

			if(layer){
				var filters = layer.getFilters();
				for(var i in filters){
					if(filters[i].getName()=='brightness'){
						filterFlag = true;
						generateSlider(layer, filters[i]);
						break;
					}
				}

				if(!filterFlag){
					var f = new Brightness();
					f.setArgs(50);
					layer.addFilter(f);
			        generateSlider(layer, f);
			        generateOverlay(this, f, layer);
				}
			}	
		}


		function handleClickOnThreshold(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var filterFlag = false;

			if(layer){
				var filters = layer.getFilters();
				for(var i in filters){
					if(filters[i].getName()=='threshold'){
						filterFlag = true;
						generateSlider(layer, filters[i]);
						break;
					}
				}

				if(!filterFlag){
					var f = new Threshold();
					f.setArgs(50);
					layer.addFilter(f);
			        generateSlider(layer, f);
			        generateOverlay(this, f, layer);
				}
			}	
		}


		function handleClickOnSharpen(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var filterFlag = false;

			if(layer){
				var filters = layer.getFilters();
				for(var i in filters){
					if(filters[i].getName()=='sharpen'){
						filterFlag = true;
						generateSlider(layer, filters[i]);
						break;
					}
				}

				if(!filterFlag){
					var f = new Sharpen();
					f.setArgs(5);
					layer.addFilter(f);
			        generateSlider(layer, f);
			        generateOverlay(this, f, layer);
				}
			}	
		}


		function handleClickOnBlur(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var filterFlag = false;

			if(layer){
				var filters = layer.getFilters();
				for(var i in filters){
					if(filters[i].getName()=='blur'){
						filterFlag = true;
						generateSlider(layer, filters[i]);
						break;
					}
				}

				if(!filterFlag){
					var f = new Blur();
					var arg = [  1/9,1/9 ,1/9,
		                    1/9,  1/9, 1/9,
		                    1/9, 1/9,  1/9 ];

					f.setArgs(arg);
					layer.addFilter(f);
			        generateSlider(layer, f);
			        generateOverlay(this, f, layer);
				}
			}	
		}


		function handleClickOnMotionBlur(){
			var layer = PhotoEditor.getInstance().getActiveLayer();
			var filterFlag = false;

			if(layer){
				var filters = layer.getFilters();
				for(var i in filters){
					if(filters[i].getName()=='motion blur'){
						filterFlag = true;
						generateSlider(layer, filters[i]);
						break;
					}
				}

				if(!filterFlag){
					var f = new MotionBlur();
					var arg=[
			            1/9, 0, 0, 0, 0, 0, 0, 0, 0,
			            0, 1/9, 0, 0, 0, 0, 0, 0, 0,
			            0, 0, 1/9, 0, 0, 0, 0, 0, 0,
			            0, 0, 0, 1/9, 0, 0, 0, 0, 0,
			            0, 0, 0, 0, 1/9, 0, 0, 0, 0,
			            0, 0, 0, 0, 0, 1/9, 0, 0, 0,
			            0, 0, 0, 0, 0, 0, 1/9, 0, 0,
			            0, 0, 0, 0, 0, 0, 0, 1/9, 0,
			            0, 0, 0, 0, 0, 0, 0, 0, 1/9,
			        ];

					f.setArgs(arg);
			        layer.addFilter(f);
			        generateSlider(layer, f);
			        generateOverlay(this, f, layer);
				}
			}	
		}


		/*
			*Generates slider for filter adjustment for the particular layer
			@params {Layer} layer
			@params {Filter} filter
		*/
		function generateSlider(layer, filter){
			var tempSlider = document.getElementById('filter-slider-wrapper');
			if(tempSlider){
				tempSlider.remove();
			}

			if(filter.getMin()!=null){
				if(fadeOutTimer!=null){
					clearInterval(fadeOutTimer);
				}

				var filterContainer = document.getElementById('filter-container');

				var div = document.createElement('div');
				div.setAttribute('class', 'filter-slider-wrapper');
				div.setAttribute('id', 'filter-slider-wrapper');

				var valueHolder = document.createElement('div');
				valueHolder.setAttribute('class', 'filter-value-holder');
				valueHolder.innerHTML = filter.getArgs();

				var slider = document.createElement('input');
				slider.setAttribute('id', 'filter-slider');
				slider.setAttribute('class', 'filter-slider');
				slider.setAttribute('type', 'range');
				slider.setAttribute('min',filter.getMin());
				slider.setAttribute('max',filter.getMax());
				slider.setAttribute('value', filter.getArgs());
				slider.setAttribute('position', 'absolute');


				var sliderMouseDown = false;
				slider.onmouseover = function(){
					clearInterval(fadeOutTimer);
					fadeOutTimer = null;
					div.style.opacity = 1;
				}

				slider.onmouseout = function(){
					fadeOut(div);
				}

				slider.onmousedown = function(){
					sliderMouseDown = true;
					var value = this.value;
					layer.setFilterArgs(filter, parseInt(this.value));
					valueHolder.innerHTML = filter.getArgs();
	                PhotoEditorUI.getInstance().renderLayers();
				}

				slider.onmouseup = function(){
					sliderMouseDown = false;
				}

				slider.onmousemove = function(){
					if(sliderMouseDown){
						var value = this.value;
						layer.setFilterArgs(filter, parseInt(this.value));
						valueHolder.innerHTML = filter.getArgs();
		                PhotoEditorUI.getInstance().renderLayers();
					}
				}

				div.appendChild(valueHolder);
				div.appendChild(slider);
				filterContainer.appendChild(div);

				fadeOut(div);
			}
		}


		function removeSlider(){
			var sliderWrapper = document.getElementsByClassName('filter-slider-wrapper')[0];
			if(sliderWrapper) sliderWrapper.remove();
			
			if(fadeOutTimer!=null){
				clearInterval(fadeOutTimer);
	            fadeOutTimer = null;
			}
		}


		/*
			*fade out slider 
			@params {Element} element
		*/
		function fadeOut(element){
			var op = 1;  // initial opacity
		    fadeOutTimer = setInterval(function () {
		    	if (op < 0.1){
		            clearInterval(fadeOutTimer);
		            fadeOutTimer = null;
		            element.style.display = 'none';
		            element.remove();
		        }
		        element.style.opacity = op;
		        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		        op -= op * 0.1;
		    }, 250);
		}
	}
	


	var instance;
	return {
		getInstance: function(){
			if(instance==null){
				instance = new FitlerBarUI();
				instance.constructor = null;
			}

			return instance;
		}
	}

})();