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

			var layers = Photoshop.getInstance().getLayers();

			while (ul.firstChild) {
	            ul.removeChild(ul.firstChild);
	        }

	        layers.sort(function(a,b){
	            return parseInt(a.getZIndex()) - parseInt(b.getZIndex());
		    });

		    listElements = [];

			for(var i in layers){

				var list = new LayerListElement(layers[i].getZIndex());

				var li = list.getListElement();
				li.setAttribute('draggable', 'true')
				li.innerHTML = 'layer '+i;
				li.addEventListener('dragstart', handleDragStart, false);
		        li.addEventListener('dragenter', handleDragEnter, false);
		        li.addEventListener('dragover', handleDragOver, false);
		        li.addEventListener('dragleave', handleDragLeave, false);
		        li.addEventListener('drop', handleDrop, false);
		        li.addEventListener('click', handleClick, false);
		        li.addEventListener('layerSelectInCanvas', handleLayerSelectInCanvas, false);

				ul.appendChild(li);
				listElements.push(list);
			}	
		}


		this.setParent = function(pEl){
			parentElement = pEl;
		}

		
		function handleLayerSelectInCanvas(e){
			console.info('i am here boy');
			var zIndex = parseInt(e.detail);
			for(var i in listElements){
				if(listElements[i].getZIndex() == zIndex){
					var li = listElements[i].getListElement();
					li.style.background = 'grey';
				}
			}
		}


		function handleClick(e){
			console.info('this: ', this);
			for(var i in listElements){
				if(this == listElements[i].getListElement()){
					console.info('hello');
					this.style.background = 'grey';
				}else{
					this.style.background = 'white';
				}
			}

		}


		function handleDragStart(ev1){
			console.info('start');
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
		    console.info('over');
		    return false;
		}

		function handleDragEnter(e) {
		  	this.classList.add('over');
		  	console.info('enter');
		}

		function handleDragLeave(e) {
		  	this.classList.remove('over');
		  	console.info('leave');
		}

		function handleDrop(e) {
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}

			console.info('drop');
			var finalValue;
			var list = parentElement.getElementsByTagName('li');
			for (var i = list.length - 1; i >= 0; i--) {
				if(this==list[i]){
					finalValue = i;
				}
			};
	  
			console.info('initial:',initial, 'final:',finalValue);
			// moveLayer(initial, finalValue);

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
}());
