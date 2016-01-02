var ToolBarUI = (function(){
	function ToolBarUI(){
		var parentElement;


		/*
			*initializes toolbar UI
		*/
		this.init = function(){
			console.log('toolbar init');
			var tools = PhotoEditor.getInstance().getTools();

			for(var i in tools){
				var toolWrapper = document.createElement('div');
				toolWrapper.setAttribute('class','tool-wrapper');
				var input = document.createElement('input');
				input.setAttribute('type', 'button');
				input.style.width = '25px';
				input.style.height = '25px';
				console.log(tools[i].getName());
				if(tools[i].getIconSrc()){
					input.style.backgroundImage = 'url("'+tools[i].getIconSrc()+'")';
					input.style.backgroundRepeat='no-repeat';
					input.style.backgroundPosition = '50% 50%';
					input.style.backgroundSize = 'cover';
					// input.style.backgroundSize = '100%';
				}
				

				input.onclick = (function(tool, allTools){
					return function(){
						PhotoEditor.getInstance().setActiveTool(tool.getName());
						var tempCanvas = PhotoEditorUI.getInstance().getCanvas().getCanvasElement();
						if(tool.getName()=='crop'){
							tempCanvas.style.cursor = 'crosshair'
						}else if(tool.getName() =='color'){
							tool.createUI();
							tempCanvas.style.cursor = 'default';
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

				toolWrapper.appendChild(input);
				parentElement.appendChild(toolWrapper);
			}
		}

		this.setParent = function(pEl){
			parentElement = pEl;
		}



		/*
			*All the following operation are for color picker, which is currently disabled in project

		*/
		// function handleColorPicker(){
		// 	var body = document.getElementsByTagName('body')[0];
		// 	var mainDiv = document.createElement('div');
		// 	mainDiv.setAttribute('class','color-picker');
		// 	mainDiv.style.position = 'absolute';
		// 	mainDiv.style.top = '100px';
		// 	mainDiv.style.left = '100px';
		// 	mainDiv.style.border = '2px solid red';


		// 	var topBar = document.createElement('div');
		// 	topBar.style.width = '200px';
		// 	topBar.style.height = '20px';
		// 	topBar.style.backgroundColor = 'red';

		// 	topBar.addEventListener('mousedown', handleTopBarMouseDown, false);
		// 	topBar.addEventListener('mouseup', handleTopBarMouseUp, false);
		// 	topBar.addEventListener('mousemove', handleTopBarMouseMove, false);

		// 	mainDiv.appendChild(topBar);

		// 	var sourceColorDiv = document.createElement('div');
		// 	var label = document.createElement('label');
		// 	label.innerHTML = 'choose Color';

		// 	var sourceColor = document.createElement('input')
		// 	sourceColor.type = 'text';
		// 	sourceColor.style.width = '100px';
		// 	sourceColorDiv.appendChild(label);
		// 	sourceColorDiv.appendChild(sourceColor);


		// 	var replaceWithDiv = document.createElement('div');
		// 	var label1 = document.createElement('label');
		// 	label1.innerHTML = 'Replace with';

		// 	var replaceWith = document.createElement('input')
		// 	replaceWith.type = 'color';
		// 	replaceWithDiv.appendChild(label1);
		// 	replaceWithDiv.appendChild(replaceWith);

		// 	var submit = document.createElement('input');
		// 	submit.type = 'button';
		// 	submit.value = 'go';

		// 	mainDiv.appendChild(sourceColorDiv);
		// 	mainDiv.appendChild(replaceWithDiv);
		// 	mainDiv.appendChild(submit);

		// 	body.appendChild(mainDiv);
		// }


		// var mouseDown = false;
		// var xCorr = 0;
		// var yCorr = 0;


		// //color picker handler
		// function handleTopBarMouseDown(e){
		// 	console.log('handling');
		// 	mouseDown = true;
		// 	var div = document.getElementsByClassName('color-picker')[0];
		// 	xCorr = e.pageX - div.offsetLeft;
		// 	yCorr = e.pageY - div.offsetTop;
		// }

		// //color picker handler
		// function handleTopBarMouseUp(e){
		// 	mouseDown = false;
		// }


		// var top  = 100;
		// var left = 100;
		// //color picker handler
		// function handleTopBarMouseMove(e){
		// 	if(mouseDown){
		// 		console.log('moving');
		// 		var div = document.getElementsByClassName('color-picker')[0];
		// 		var x = e.pageX;
		// 		var y = e.pageY;


		// 		div.style.left = (x-xCorr) +'px';
		// 		div.style.top = (y-yCorr) +'px';

		// 	// console.log('x:',x,' y:',y);
		// 	}
		// }

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
