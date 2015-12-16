function Filter(){

	
}

Filter.prototype.getPixels = function(pic) {
	var picture = pic;
	var dimen = picture.getDimension();
	var pos = picture.getPosition();
  return ctx.getImageData(pos.posX,pos.posY,dimen.width,dimen.height);
};

Filter.prototype.filterImage = function(filter, pic, var_args) {
	var args = [this.getPixels(pic)];
	for (var i=2; i<arguments.length; i++) {
	args.push(arguments[i]);
	}
	return filter.apply(null, args);
};

Filter.prototype.display = function(){
	console.info('dispalyeddispalyed');
}
