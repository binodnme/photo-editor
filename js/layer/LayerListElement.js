function LayerListElement(zi){
	var zIndex =zi;
	var listElement = document.createElement('li');

	this.getListElement = function(){
		return listElement;
	}

	this.getZIndex = function(){
		return zIndex;
	}

}