function Brightness(){
	var name='brightness';
	var min = -100;
	var max = 100;
	var active = true;
	var testArg;

	this.filter = function(pixels, adjustment) {
	  var d = pixels.data;
	  for (var i=0; i<d.length; i+=4) {
	    d[i] += adjustment;
	    d[i+1] += adjustment;
	    d[i+2] += adjustment;
	  }
	  testArg = adjustment;
	  return pixels;
	};

	console.info('brightness done');

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
		return testArg;
	}

	this.setArgs = function(val){
		testArg = val;
	}

}


var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
    console.info('inherit');
};

inheritsFrom(Brightness, Filter);

// Photoshop.getInstance().addFilter();