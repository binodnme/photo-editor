function Brightness(){
	this.name='brightness';
	this.min = -100;
	this.max = 100;
	var testArg;

	this.filter = function(pixels, adjustment) {
		// var adjustment = 50;
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