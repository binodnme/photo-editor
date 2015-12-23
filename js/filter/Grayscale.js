function Grayscale(){
	var name='grayscale';
	var active = true;
	var testArg;
	// this.min = 10;
	// this.max = 100;
	var propertyEditer;
	

	this.filter = function(pixels, args) {
	  var d = pixels.data;
	  for (var i=0; i<d.length; i+=4) {
	    var r = d[i];
	    var g = d[i+1];
	    var b = d[i+2];
	    // CIE luminance for the RGB
	    // The human eye is bad at seeing red and blue, so we de-emphasize them.
	    var v = 0.2126*r + 0.7152*g + 0.0722*b;
	    // var v = (args*r + args*g + args*b)/100;
	    d[i] = d[i+1] = d[i+2] = v
	  }
	  return pixels;
	};

	this.getName = function(){
		return name;
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

	this.getMin = function(){
		return null;
	}

	this.getMax = function(){
		return null;
	}

	this.getArgs = function(){
		return testArg;
	}

	this.setArgs = function(val){
		testArg = val;
	}

	console.info('grayscale done');

}


var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
    console.info('inherit');
};

inheritsFrom(Grayscale, Filter);