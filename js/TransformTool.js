function TransformTool(){

	var pos;
	var dimen;

	function resizeLayer(layer, side, x1, y1){
	    var lyr = layer;
	    var pic = lyr.getPicture();
	    var dimension = pic.getDimension();
	    var position = pic.getPosition();

	    var pos = position;
	    var dimen = dimension;

	    if(side==1){
	        //top
	        cnvs.style.cursor = 'n-resize';    
	        if(mousedown){
	            pic.setDimension(dimension.width, dimension.height+position.posY-y1);
	           	pic.setPosition(position.posY, y1);
	            myCanvas.renderLayers();
	            drawOutline(position, dimension);
	        }
	    }else if(side==2){
	        //bottom
	        cnvs.style.cursor = 's-resize';
	        if(mousedown){
	            pic.setDimension(dimension.width, y1-position.posY);
	            myCanvas.renderLayers();
	            drawOutline(position, dimension);
	        }
	    }else if(side==3){
	        //left
	        cnvs.style.cursor = 'w-resize';
	    }else if(side==4){
	        //right
	        cnvs.style.cursor = 'e-resize';
	        if(mousedown){
	            pic.setDimension(x1-position.posX, dimension.height);
	            myCanvas.renderLayers();
	            drawOutline(position, dimension);
	        }
	    }
	    
	}
	
}