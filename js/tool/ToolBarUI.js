var ToolBarUI = (function(){
	function ToolBarUI(){
		var parentElement;

		this.init = function(){
			console.log('toolbar init');
			var tools = Photoshop.getInstance().getTools();

			for(var i in tools){
				var input = document.createElement('input');
				input.setAttribute('type', 'button');
				input.value = tools[i].getName();

				input.onclick = (function(tool){
					return function(){
						Photoshop.getInstance().setActiveTool(tool.getName());
					};
				})(tools[i]);

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
