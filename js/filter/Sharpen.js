function Sharpen(){
	var name='sharpen'
	var min = 1;
	var max = 10;
	var active = true;
	var args;


	/*
		*apply Sharpen filter in given pixels using the weight
		@params {Array} pixels
		@params {Number} weight
		@return {Array}
	*/
	this.filter = function(pixels, weight) {

		if((parseInt(weight) - weight) == 0){
			var matrix = createMatrix(weight);
			var conv = new Convolution();
			return conv.filter(pixels, matrix);
		}
		
		
	};


	/*
		*Creates Array/Matrix according to the input weight
		@params {Number} weight
		@return {Array}
	*/
	function createMatrix(weight){
		//assuming 3*3 matrix
		var centerValue = weight;
		var sv = -(weight-1)/8;		//side values

		return [sv,sv,sv,
				sv,centerValue, sv,
				sv,sv,sv];
	}


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
};

//inherit Sharpen from Filter class
inheritsFrom(Sharpen, Filter);