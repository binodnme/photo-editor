function MotionBlur(){
	var name='motionblur'
	var min = 0;
	var max = 10;
	var active = true;
	var args;


	/*
		*apply Motion Blur filter in given pixels using the weight(Array/matrix)
		@params {Array} pixels
		@params {Array} weight
		@return {Array}
	*/
	this.filter = function(pixels, weight) {
		var conv = new Convolution();
		return conv.filter(pixels, weight);
	};


	this.getName = function(){
		return name;
	}


	this.getMin = function(){
		return null;
	}


	this.getMax = function(){
		return max;
	}


	this.enable = function(){
		active = true;
	}


	this.disable = function(){
		active = false;
	}


	this.isActive = function(){
		return active;
	}


	this.getArgs = function(){
		return args;
	}


	this.setArgs = function(val){
		args = val;
	}
}


var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

//inherit MotionBlur from Filter class
inheritsFrom(MotionBlur, Filter);