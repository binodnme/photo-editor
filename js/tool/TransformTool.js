var TransformTool = (function(){
	var iconSrc = 'images/icons/transform.png';
	var mouseDown = false;
	var side = 0;



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

		this.getIconSrc = function(){
			return iconSrc;
		}

		this.enableMouseDown = function(){
			mouseDown = true;
			console.log('mouse down enabled');
		}

		this.disableMouseDown = function(){
			mouseDown = false;
			console.log('mouse down disabled');
		}

		this.isMouseDown = function(){
			return mouseDown;
		}

		this.setSide = function(s){
			side = s;
		}

		this.getSide = function(){
			return side;
		}

		this.transform = function(){

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