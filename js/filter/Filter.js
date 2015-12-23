function Filter(){

	
}

Filter.prototype.getPixels = function(pic) {
	var picture = pic;
	var dimen = picture.getDimension();
	var pos = picture.getPosition();
	var context = PhotoEditorUI.getInstance().getCanvas().getContext();
	var tempCanvas = document.createElement('canvas');
	tempCanvas.width = dimen.width;
	tempCanvas.height = dimen.height;
	var ctx = tempCanvas.getContext('2d');

	ctx.drawImage(picture.getImage(),0,0);
  	// return context.getImageData(pos.posX,pos.posY,dimen.width,dimen.height);
  	console.log('width:',dimen.width, 'height:',dimen.height);
  	return ctx.getImageData(0,0,dimen.width,dimen.height);
};

Filter.prototype.filterImage = function(filter, pixels, var_args) {
	// var args = [this.getPixels(pic)];
	var args = [pixels]
	for (var i=2; i<arguments.length; i++) {
	args.push(arguments[i]);
	}
	return filter.apply(null, args);
};

Filter.prototype.display = function(){
	console.info('dispalyeddispalyed');
}
