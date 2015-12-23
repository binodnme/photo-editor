function Threshold(){
	var name='threshold'
	var min = 10;
	var max = 200;
	var active = true;
	var args;

	this.filter = function(pixels, threshold) {
		
		var d = pixels.data;
		for (var i=0; i<d.length; i+=4) {
			var r = d[i];
			var g = d[i+1];
			var b = d[i+2];
			var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
			d[i] = d[i+1] = d[i+2] = v
		}
		testArg = threshold;
		return pixels;
	};

	console.info('threshold done');


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
		// console.info('enabled');
	}

	this.disable = function(){
		active = false;
		// console.info('disabled');
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

inheritsFrom(Threshold, Filter);