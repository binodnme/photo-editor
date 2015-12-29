function Threshold(){
	var name='threshold'
	var min = 10;
	var max = 200;
	var active = true;
	var args;


	/*
		*apply threshold filter in given pixels using the threshold value
		@params {Array} pixels
		@params {Number} threshold
		@return {Array}
	*/
	this.filter = function(pixels, threshold) {
		
		var d = pixels.data;
		for (var i=0; i<d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
			d[i] = d[i+1] = d[i+2] = v
		}
		args = threshold;
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
		return args;
	}


	this.setArgs = function(val){
		args = val;
	}
}

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
    console.info('inherit');
};

//inherit Threshold from Filter class
inheritsFrom(Threshold, Filter);