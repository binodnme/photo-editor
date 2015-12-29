function Grayscale(){
	var name='grayscale';
	var active = true;
	var testArg;
	
	/*
		*apply Grayscale filter in given pixels 
		@params {Array} pixels
		@return {Array}
	*/
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
	}


	this.disable = function(){
		active = false;
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
}


var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

//inherit Grayscale from Filter class
inheritsFrom(Grayscale, Filter);