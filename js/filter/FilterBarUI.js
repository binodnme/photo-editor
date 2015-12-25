var FitlerBarUI = (function(){
	function FitlerBarUI(){

		var fadeOutTimer = null;
		// var timerFlag = false;

		this.init = function(){
			console.info('initializing fitler bar');
			var allFilters = document.getElementById('all-filters');

			var filterList = document.createElement('ul');
			
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

			var threshold = document.createElement('li');
			threshold.setAttribute('class', 'threshold');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Threshold';
			threshold.appendChild(div);
			threshold.appendChild(layerName);
			threshold.addEventListener('click', handleClickOnThreshold, false);

			var sharpen = document.createElement('li');
			sharpen.setAttribute('class', 'sharpen');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Sharpen';
			sharpen.appendChild(div);
			sharpen.appendChild(layerName);
			sharpen.addEventListener('click', handleClickOnSharpen, false);

			var blur = document.createElement('li');
			blur.setAttribute('class', 'blur');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Blur';
			blur.appendChild(div);
			blur.appendChild(layerName);
			blur.addEventListener('click', handleClickOnBlur, false);


			var motionBlur = document.createElement('li');
			motionBlur.setAttribute('class', 'motion-blur');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			var layerName = document.createElement('span');
			layerName.innerHTML = 'Motion Blur';
			motionBlur.appendChild(div);
			motionBlur.appendChild(layerName);
			motionBlur.addEventListener('click', handleClickOnMotionBlur, false);


			filterList.appendChild(grayscale);
			filterList.appendChild(brightness);
			filterList.appendChild(threshold);
			filterList.appendChild(sharpen);
			filterList.appendChild(blur);
			filterList.appendChild(motionBlur);
			allFilters.appendChild(filterList);
		}


		function addlayerSelectInCanvasHandler(element, filterName){
			element.addEventListener('layerSelectInCanvas', function(){
				// console.log('i am listening, by', filterName);
				var zIndex = parseInt(event.detail);

				var layer = PhotoEditor.getInstance().getLayerByZIndex(zIndex);
				var filters = layer.getFilters();
				console.log('filters from top : ', filters);

				var hasFilter = false;
				for(var i in filters){
					var filter = filters[i];
					if(filter.getName()==filterName){
						
						var filterElement = element.getElementsByClassName('filter')[0];
						filterElement.style.borderTop = '2px solid blue';

						var div = filterElement.getElementsByClassName('over-filter');
						if(div.length){
							div[0].remove();
						}

						var div = document.createElement('div');
						div.setAttribute('class', 'over-filter')

						// var topDiv = document.createElement('div');
						// topDiv.setAttribute('class', 'top-div');

						// var edit = document.createElement('div');
						// edit.setAttribute('class', 'edit-div')
						// edit.innerHTML = 'edit';
						// topDiv.appendChild(edit);


						var bottomDiv = document.createElement('div');
						bottomDiv.setAttribute('class', 'bottom-div');
						var bottomLeft = document.createElement('div');
						bottomLeft.setAttribute('class', 'bottom-left')
						
						var hide = document.createElement('div');
						hide.setAttribute('class', 'hide-div');
						if(filter.isActive()){
							hide.innerHTML = 'hide';	
						}else{
							hide.innerHTML = 'show';
						}
						bottomLeft.appendChild(hide);


						var bottomRight = document.createElement('div');
						bottomRight.setAttribute('class', 'bottom-right')
						
						var remove = document.createElement('div');
						remove.setAttribute('class', 'remove-div');
						remove.innerHTML = 'remove';
						bottomRight.appendChild(remove);


						bottomDiv.appendChild(bottomLeft);
						bottomDiv.appendChild(bottomRight);


						// edit.onclick = function(){
						// 	console.log('you clicked edit in ', filterName);
						// 	generateSlider(layer, filter);
						// }

						hide.onclick = function(){
							if(filter.isActive()){
								filter.disable();
								this.innerHTML = 'show';
							}else{
								filter.enable();
								this.innerHTML = 'hide';
							}
							PhotoEditorUI.getInstance().renderLayers();
						}

						remove.onclick = function(){
							console.info('filters: ', filters);
							// filters = filters.splice(i,1);
							// filters.splice(i,1);
							// var fltrs = layer.getFilters();
							// for (var i = 0; i < fltrs.length; i++) {
							// 	if(fltrs[i].getName()==filterName){
							// 		fltrs.splice(i,1);
							// 		console.log('removed');
							// 		break;
							// 	}
							// };
							layer.removeFilter(filter);
							console.info('filters: ', filters);

							div.remove();
							PhotoEditorUI.getInstance().renderLayers();

						}

						// div.appendChild(topDiv);
						div.appendChild(bottomDiv);

						filterElement.appendChild(div);

						hasFilter = true;
						break;
					}else{
						console.log('No. ', filterName);
					}
				}

				if(!hasFilter){
					var filterElement = element.getElementsByClassName('filter')[0];
					filterElement.style.borderTop = '2px solid black';
					var div = filterElement.getElementsByClassName('over-filter');

					if(div.length){
						div[0].remove();
					}
				}

				// console.info('name: ', layer.getName());
			}, false);
		}

		function handleClickOnGrayscale(){
			console.info('grayscale');
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
					f.setArgs(50);
			        layer.getFilters().push(f);
			        PhotoEditorUI.getInstance().renderLayers();
			        generateSlider(layer, f);
			        var filter = this.getElementsByClassName('filter')[0];
					filter.style.borderTop = '2px solid blue';
				}


			}	
		}

		function handleClickOnBrightness(){
			console.info('brightness');
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
			        layer.getFilters().push(f);
			        PhotoEditorUI.getInstance().renderLayers();
			        generateSlider(layer, f);
			        var filter = this.getElementsByClassName('filter')[0];
					filter.style.borderTop = '2px solid blue';
				}
			}	
		}

		function handleClickOnThreshold(){
			console.info('threshold');
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
			        layer.getFilters().push(f);
			        PhotoEditorUI.getInstance().renderLayers();
			        generateSlider(layer, f);
				}
			}	
		}

		function handleClickOnSharpen(){
			console.info('sharpen');
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
					f.setArgs([  0, -1,  0,
	                     -1,  5, -1,
	                     0, -1,  0 ]);

			        layer.getFilters().push(f);
			        PhotoEditorUI.getInstance().renderLayers();
			        generateSlider(layer, f);
				}
			}	
		}

		function handleClickOnBlur(){
			console.info('blur');
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

			        layer.getFilters().push(f);
			        PhotoEditorUI.getInstance().renderLayers();
			        generateSlider(layer, f);
				}
			}	
		}

		function handleClickOnMotionBlur(){
			console.info('motion blur');
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

			        layer.getFilters().push(f);
			        PhotoEditorUI.getInstance().renderLayers();
			        generateSlider(layer, f);
				}
			}	
		}


		function generateSlider(layer, filter){
			if(filter.getMin()!=null){
				console.info('i have min ');
				if(fadeOutTimer!=null){
					clearInterval(fadeOutTimer);
				}

				var filterContainer = document.getElementById('filter-container');

				var tempSlider = document.getElementById('filter-slider-wrapper');
				if(tempSlider){
					tempSlider.remove();
				}

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
					filter.setArgs(parseInt(this.value));
					valueHolder.innerHTML = filter.getArgs();
	                PhotoEditorUI.getInstance().renderLayers();
				}

				slider.onmouseup = function(){
					sliderMouseDown = false;
				}

				slider.onmousemove = function(){
					if(sliderMouseDown){
						var value = this.value;
						filter.setArgs(parseInt(this.value));
						valueHolder.innerHTML = filter.getArgs();
		                PhotoEditorUI.getInstance().renderLayers();
					}
				}

				div.appendChild(valueHolder);
				div.appendChild(slider);
				filterContainer.appendChild(div);

				fadeOut(div);


			}else{
				console.info('sorry i donot have ');
			}
		}

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