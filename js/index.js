console.log('start');

var canvas = document.getElementById('playground');
var ctx = canvas.getContext('2d');

var pic = new Picture();
pic.setImageSrc("./images/b.jpg");

pic.getImage().onload = function(){
    pic.setDimension(pic.getImage().width, pic.getImage().height);
    ctx.drawImage(pic.getImage(),0,0);
}


canvas.onclick = function(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//    console.log('x:',x, ' y:',y);
    pic.setPosition(x,y);
    pic.draw(ctx);
}