var ToolBarUI = (function(){
	function ToolBarUI(){
		var parentElement;

		this.init = function(){
			console.log('toolbar init');
			var tools = PhotoEditor.getInstance().getTools();

			for(var i in tools){
				var input = document.createElement('input');
				input.setAttribute('type', 'button');
				input.style.width = '35px';
				input.style.height = '35px';
				// input.value = tools[i].getName();
				input.style.backgroundImage = 'url("'+tools[i].getIconSrc()+'")';
				input.style.backgroundRepeat='no-repeat';

				input.onclick = (function(tool, allTools){
					return function(){
						PhotoEditor.getInstance().setActiveTool(tool.getName());
						var tempCanvas = PhotoEditorUI.getInstance().getCanvas().getCanvasElement();
						if(tool.getName()=='crop'){
							tempCanvas.style.cursor = 'crosshair'
						}else{
							tempCanvas.style.cursor = 'default';
						}

						for(var j in allTools){
							if(tool!=allTools[j]){
								allTools[j].reset();
							}
						}
					};
				})(tools[i], tools);

				parentElement.appendChild(input);
			}
		}

		this.setParent = function(pEl){
			parentElement = pEl;
		}
	}


	var instance;
	return {
		getInstance: function(){
			if(instance==null){
				instance = new ToolBarUI();
				instance.constructor = null;
			}

			return instance;
		}
	}
}());
