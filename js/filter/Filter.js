function Filter(){}


/*
	*returns pixels of input Picture object
	@params {Picture} pic
	@return {Array} imageData
*/
Filter.prototype.getPixels = function(pic) {
	var picture = pic;
	var image = picture.getImage();

	//Note: the dimension of image Object is taken rather than Picture Object
	//Image dimension holds the actual image size, while the Picture Dimension holds the rendering size
	var dimenX = image.width;
	var dimenY = image.height;
	var dimen = {width:dimenX, height:dimenY};
	var pos = picture.getPosition();
	var context = PhotoEditorUI.getInstance().getCanvas().getContext();
	
	//temporary canvas is created with dimension equal to that of image Object to extract image data from Image Object
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = dimen.width;
	tempCanvas.height = dimen.height;
	var ctx = tempCanvas.getContext('2d');

	ctx.drawImage(picture.getImage(),0,0);
  	return ctx.getImageData(0,0,dimen.width,dimen.height);
};



/*
	*returns filtered pixels data using the input filter type (grayscale, threshold, ....)
	@params {Filter} filter
	@params {Array} pixels
	@params var_args
	@return {Arrays} pixelsValue
*/
Filter.prototype.filterImage = function(filter, pixels, var_args) {
	// var args = [this.getPixels(pic)];
	var args = [pixels]
	for (var i=2; i<arguments.length; i++) {
	args.push(arguments[i]);
	}
	return filter.apply(null, args);
};
