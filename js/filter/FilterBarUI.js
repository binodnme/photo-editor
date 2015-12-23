var FitlerBarUI = (function(){
	function FitlerBarUI(){
		this.init = function(){
			console.info('initializing fitler bar');
			var allFilters = document.getElementById('all-filters');

			var filterList = document.createElement('ul');
			
			var grayscale = document.createElement('li');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			div.innerHTML = 'grayscale';
			grayscale.appendChild(div);
			grayscale.addEventListener('click', handleClickOnGrayscale, false);


			var brightness = document.createElement('li');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			div.innerHTML = 'brightness';
			brightness.appendChild(div);
			brightness.addEventListener('click', handleClickOnBrightness, false);


			var threshold = document.createElement('li');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			div.innerHTML = 'threshold';
			threshold.appendChild(div);
			threshold.addEventListener('click', handleClickOnThreshold, false);

			var sharpen = document.createElement('li');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			div.innerHTML = 'sharpen';
			sharpen.appendChild(div);
			sharpen.addEventListener('click', handleClickOnSharpen, false);

			var blur = document.createElement('li');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			div.innerHTML = 'blur';
			blur.appendChild(div);
			blur.addEventListener('click', handleClickOnBlur, false);


			var motionBlur = document.createElement('li');
			var div = document.createElement('div');
			div.setAttribute('class', 'filter');
			div.innerHTML = 'motionBlur';
			motionBlur.appendChild(div);
			motionBlur.addEventListener('click', handleClickOnMotionBlur, false);


			filterList.appendChild(grayscale);
			filterList.appendChild(brightness);
			filterList.appendChild(threshold);
			filterList.appendChild(sharpen);
			filterList.appendChild(blur);
			filterList.appendChild(motionBlur);
			allFilters.appendChild(filterList);

		}
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
			var filterContainer = document.getElementById('filter-container');

			var tempSlider = document.getElementById('filter-slider-wrapper');
			if(tempSlider){
				tempSlider.remove();
			}

			var div = document.createElement('div');
			div.setAttribute('class', 'filter-slider-wrapper');
			div.setAttribute('id', 'filter-slider-wrapper');
			var slider = document.createElement('input');
			slider.setAttribute('id', 'filter-slider');
			slider.setAttribute('class', 'filter-slider');
			slider.setAttribute('type', 'range');
			slider.setAttribute('min',filter.getMin());
			slider.setAttribute('max',filter.getMax());
			slider.setAttribute('value', filter.getArgs());
			slider.setAttribute('position', 'absolute');

			slider.onchange = function(){
				console.log('you have changed me honey :(');
					var value = this.value;
					console.info('value is: ', value);
					filter.setArgs(parseInt(this.value));
                    PhotoEditorUI.getInstance().renderLayers();
			}


			div.appendChild(slider);
			filterContainer.appendChild(div);

			// fadeOut(div);


		}else{
			console.info('sorry i donot have ');
		}

	}

	function fadeOut(element){
		var op = 1;  // initial opacity
	    var timer = setInterval(function () {
	        if (op <= 0.1){
	            clearInterval(timer);
	            element.style.display = 'none';
	            element.remove();
	        }
	        element.style.opacity = op;
	        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
	        op -= op * 0.1;
	    }, 250);
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