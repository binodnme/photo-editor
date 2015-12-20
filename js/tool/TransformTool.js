var TransformTool = (function(){
	function TransformTool(){
		// var id =2;
		var name = 'transform';

		// this.getId = function(){
		// 	return id;
		// }

		this.getName = function(){
			return name;
		}

		this.reset = function(){
			console.info('reset transform tool');
		}
	}	


	var instance;
	return {
		getInstance: function(){
			if(instance==null){
				instance = new TransformTool();

				instance.constructor = null;
			}

			return instance;
		}
	};
}());


PhotoEditor.getInstance().addTool(TransformTool.getInstance());