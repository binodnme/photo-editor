function drawOutline(pos, dimen){
    console.info('called');
    ctx.save();
    ctx.setLineDash([1,2]);
    ctx.beginPath();
    var offsetTest =0;
    ctx.moveTo(pos.posX, pos.posY);
    ctx.lineTo(pos.posX+dimen.width, pos.posY);
    ctx.lineTo(pos.posX+dimen.width,pos.posY+dimen.height);
    ctx.lineTo(pos.posX, pos.posY+dimen.height);
    ctx.lineTo(pos.posX, pos.posY);
    ctx.strokeStyle='#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    drawTransformDots(pos, dimen);
}


function drawTransformDots(pos, dimen){
    var offset=3;
    drawDots(pos, offset);

    var posRight = {'posX':pos.posX+dimen.width, 'posY':pos.posY}
    drawDots(posRight, offset);

    var posRightBottom = {'posX':pos.posX+dimen.width, 'posY':pos.posY+dimen.height}
    drawDots(posRightBottom, offset);

    var posLeftBottom = {'posX':pos.posX, 'posY':pos.posY+dimen.height}
    drawDots(posLeftBottom, offset);

    var posCenterTop = {'posX':pos.posX+dimen.width/2, 'posY':pos.posY}
    drawDots(posCenterTop, offset);

    var posCenterBottom = {'posX':pos.posX+dimen.width/2, 'posY':pos.posY+dimen.height}
    drawDots(posCenterBottom, offset);

    var posMiddleLeft = {'posX':pos.posX, 'posY':pos.posY+dimen.height/2}
    drawDots(posMiddleLeft, offset);

    var posMiddleRight = {'posX':pos.posX+dimen.width, 'posY':pos.posY+dimen.height/2}
    drawDots(posMiddleRight, offset);
}


function drawDots(pos, offset){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pos.posX-offset, pos.posY-offset);
    ctx.lineTo(pos.posX+2*offset, pos.posY-offset);
    ctx.lineTo(pos.posX+2*offset, pos.posY-offset+2*offset);
    ctx.lineTo(pos.posX-offset, pos.posY-offset+2*offset);
    ctx.lineTo(pos.posX-offset, pos.posY-offset);
    ctx.strokeStyle='red';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
}

function isOverOutline(x,y,pos,dimen){
    var offset = 10;

    if(x>=pos.posX && x<=(pos.posX+dimen.width) && y<=(pos.posY+offset) && y>=(pos.posY-offset)){
        //top border detection
        // console.info('top border');
        return 1;
    }else if(x>=pos.posX && x<=(pos.posX+dimen.width) && y<=(pos.posY+dimen.height+offset) && y>=(pos.posY+dimen.height-offset)){
        //bottom border detection
        // console.log('bottom border')
        return 2;
    }else if(y>=pos.posY && y<=(pos.posY+dimen.height) && x<=pos.posX+offset && x>=pos.posX-offset){
        //left border detection
        // console.info('left border');
        return 3;
    }else if(y>=pos.posY && y<=(pos.posY+dimen.height) && x<=(pos.posX+dimen.width+offset) && x>=(pos.posX+dimen.width-offset)){
        //left border detection
        // console.info('right border');
        return 4;
    }

    return 0;
}