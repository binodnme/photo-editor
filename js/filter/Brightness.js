function Brightness(){
	var name='brightness';
	var min = -100;
	var max = 100;
	var active = true;
	var arg;


	/*
		*apply brightness filter in given pixels using the adjustment
		@params {Array} pixels
		@params {Number} adjustment
		@return {Array}
	*/
	this.filter = function(pixels, adjustment) {
	  var d = pixels.data;
	  for (var i=0; i<d.length; i+=4) {
	    d[i] += adjustment;
	    d[i+1] += adjustment;
	    d[i+2] += adjustment;
	  }
	  arg = adjustment;
	  return pixels;
	};

	
	this.getName = function(){
		return name;
	}

	
	this.getMin = function(){
		return min;
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
		return arg;
	}

	
	this.setArgs = function(val){
		arg = val;
	}

}


var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

//inherit Brightness from Filter class
inheritsFrom(Brightness, Filter);