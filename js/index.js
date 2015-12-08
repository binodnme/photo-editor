console.log('start');

var canvas = document.getElementById('playground');
var ctx = canvas.getContext('2d');

var image1 = new Image();
image1.src = "./images/a.jpg";

var image2 = new Image();
image2.src = "./images/b.jpg";

var arr = [];
var pic1 = new Picture();
pic1.setImage(image1);

arr.push(pic1);

var pic2 = new Picture();
pic2.setImage(image2);

arr.push(pic2);

pic1.getImage().onload = function(){
    pic1.setDimension(pic1.getImage().width, pic1.getImage().height);
    pic1.draw(ctx,0,0);
//    ctx.drawImage(pic.getImage(),0,0);
}

pic2.getImage().onload = function(){
    pic2.setDimension(pic2.getImage().width, pic2.getImage().height);
    pic2.draw(ctx,100,100);
//    ctx.drawImage(pic.getImage(),0,0);
}

var mousedown = false;
var imageSelected = false;
canvas.onmousedown = function(e1){
    console.log('hello down');
    mousedown = true;
    
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    
    var index;
    for(var i in arr){
        var dimen = arr[i].getDimension();
        var pos = arr[i].getPosition();
        if(x>=pos.posX && x<=(pos.posX+dimen.width) && y>=pos.posY && y<=(pos.posY+dimen.height)){
            imageSelected = true;
            console.log(imageSelected);
            index = i;
            break;
        }    
    }
    
    
    canvas.onmousemove = function(e2){
        if(mousedown && imageSelected){
            var x1 = event.pageX - canvas.offsetLeft;
            var y1 = event.pageY - canvas.offsetTop;
            arr[index].setPosition(x1,y1);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            for(var i in arr){
                arr[i].draw(ctx);    
            }
            
        }
    }
}

canvas.onmouseup = function(){
    mousedown = false;
    imageSelected = false;
}