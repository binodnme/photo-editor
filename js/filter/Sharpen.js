function Sharpen(){
	var name='sharpen'
	var min = 0;
	var max = 10;
	var active = true;
	var args;

	this.filter = function(pixels, weight) {
		var conv = new Convolution();
		// t.setArgs(weight);
		return conv.filter(pixels, weight);
		
	};

	console.info('sharpen done');


	this.getName = function(){
		return name;
	}

	this.getMin = function(){
		// return min;
		return null;
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

inheritsFrom(Sharpen, Filter);