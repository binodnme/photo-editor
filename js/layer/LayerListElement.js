/*this class is used to hold the li element and map it with the z-index*/
function LayerListElement(zi){
	var zIndex =zi;
	var listElement = document.createElement('li');
	var totalClicks = 0;
	var doubleClick = false;


	this.getListElement = function(){
		return listElement;
	}


	this.getZIndex = function(){
		return zIndex;
	}


	this.increaseTotalClicks = function(){
		totalClicks++;
		if(totalClicks >= 2){
			doubleClick = true;
		}
	}


	this.isDoubleClick = function(){
		return doubleClick;
	}


	this.enableDoubleClick = function(){
		doubleClick = true;
	}


	this.disableDoubleClick = function(){
		doubleClick = false;
	}


	this.resetTotalClicks = function(){
		totalClicks = 0;
	}


	this.getTotalClicks = function(){
		return totalClicks;
	}

}