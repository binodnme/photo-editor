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
		console.info('total clicks ', totalClicks);
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
		console.info('total clicks ', totalClicks);
	}

	this.getTotalClicks = function(){
		console.info('total clicks ', totalClicks);
		return totalClicks;

	}

}