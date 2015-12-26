function Sharpen(){
	var name='sharpen'
	var min = 1;
	var max = 10;
	var active = true;
	var args;

	this.filter = function(pixels, weight) {

		if((parseInt(weight) - weight) == 0){
			var matrix = createMatrix(weight);
			// console.info('matrix: ', matrix);
			var conv = new Convolution();
			// t.setArgs(weight);
			return conv.filter(pixels, matrix);
		}
		
		
	};

	function createMatrix(weight){
		//assuming 3*3 matrix
		var centerValue = weight;
		var sv = -(weight-1)/8;		//side values

		return [sv,sv,sv,
				sv,centerValue, sv,
				sv,sv,sv];
	}

	console.info('sharpen done');


	this.getName = function(){
		return name;
	}

	this.getMin = function(){
		return min;
		// return null;
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