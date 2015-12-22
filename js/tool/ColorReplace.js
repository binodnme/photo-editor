
var ColorReplace = (function(){
    var iconSrc = 'images/icons/crop.png';   //source for icon file
    var sourceColor;
    var replaceWithColor;

    var mouseDown = false;
    var xCorr = 0;
    var yCorr = 0;
    var top  = 100;
    var left = 100;

    var penActive = false;

    var that = this;

    function ColorReplace() {
        var name='color';
        // var 

        
        this.getName = function(){
            return name;
        }

        this.getIconSrc = function(){
            return iconSrc;
        }

        this.reset = function(){
            console.info('reset select tool');
        }

        this.setSourceColor = function(sc, string){
            console.log('string: ', string);
            if(string){
                penActive = false;
                console.log('penactive ', penActive);
            }

            if(penActive){
                sourceColor = sc;
                console.log('source color: ', sourceColor);
                var sourceColorEl = document.getElementById('source-color');
                var hexValue = rgbToHex(sc[0],sc[1],sc[2]);
                // sourceColor.value = sc[0]+','+sc[1]+','+sc[2];    
                sourceColorEl.value = hexValue;
            }
            

        }

        this.getSourceColor = function(){
            return sourceColor;
        }

        this.setReplaceWithColor = function(rwc){
            replaceWithColor = rwc;
            // console.log('replace with: ', replaceWithColor);
        }

        this.getReplaceWithColor = function(){
            return replaceWithColor;
        }

        var replaceColor = function(){
            var layer = PhotoEditor.getInstance().getActiveLayer();
            var pic = layer.getPicture();
            var mainFilter = new Filter();
            var pixels = mainFilter.getPixels(pic);

            var iColor = sourceColor;
            var fColor = replaceWithColor;
            console.info('icolor alsjdfa', sourceColor);

            for (var i = pixels.data.length - 1; i >= 0; i-=4) {
                
                if(pixels.data[i-1]==iColor[2] && pixels.data[i-2]==iColor[1] && pixels.data[i-3]==iColor[0]){
                    // console.info('matched');
                    pixels.data[i-1] = fColor[2];
                    pixels.data[i-2] = fColor[1];
                    pixels.data[i-3] = fColor[0];
                    // break;
                }
            };

            var cnvs = document.createElement('canvas');
            cnvs.width = pixels.width;
            cnvs.height = pixels.height;

            var ctx = cnvs.getContext('2d');
            ctx.putImageData(pixels, 0,0);

            var img = new Image();
            img.src = cnvs.toDataURL('image/png');

            pic.setImageSrc(img.src);

            PhotoEditorUI.getInstance().renderLayers();
        }


        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }



        function hexToRGB(hexColor){
            hex = hexColor.replace(/[^0-9A-F]/gi, '');
            console.info('hex : ', hex);
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;

            return [r,g,b];
        }


        this.createUI = function(){
            var body = document.getElementsByTagName('body')[0];
            var mainDiv = document.createElement('div');
            mainDiv.setAttribute('class','color-picker');
            mainDiv.style.position = 'absolute';
            mainDiv.style.top = top+'px';
            mainDiv.style.left = left+'px';
            mainDiv.style.border = '2px solid red';


            var topBar = document.createElement('div');
            topBar.style.width = '200px';
            topBar.style.height = '20px';
            topBar.style.backgroundColor = 'red';

            topBar.addEventListener('mousedown', handleTopBarMouseDown, false);
            topBar.addEventListener('mouseup', handleTopBarMouseUp, false);
            topBar.addEventListener('mousemove', handleTopBarMouseMove, false);

            mainDiv.appendChild(topBar);

            var sourceColorDiv = document.createElement('div');
            var label = document.createElement('label');
            label.innerHTML = 'choose Color';

            var sourceColor = document.createElement('input');
            sourceColor.setAttribute('id', 'source-color')
            sourceColor.type = 'text';
            sourceColor.style.width = '80px';

            var pen = document.createElement('input');
            pen.type = 'button';
            pen.value = 'p';

            pen.onclick = function(){
                penActive = true;
            }

            sourceColorDiv.appendChild(label);
            sourceColorDiv.appendChild(sourceColor);
            sourceColorDiv.appendChild(pen);

            var replaceWithDiv = document.createElement('div');
            var label1 = document.createElement('label');
            label1.innerHTML = 'Replace with';

            var replaceWith = document.createElement('input')
            replaceWith.type = 'color';
            replaceWithDiv.appendChild(label1);
            replaceWithDiv.appendChild(replaceWith);

            replaceWith.onchange = function(e){
                console.log('changed');
                var value = this.value;
                console.info('value: ', value);
                replaceWithColor = hexToRGB(value);
                console.info('replace with rgb', replaceWithColor);

            }

            var submit = document.createElement('input');
            submit.type = 'button';
            submit.value = 'go';

            submit.onclick = function(e){
                replaceColor();
                mainDiv.remove();
            }

            mainDiv.appendChild(sourceColorDiv);
            mainDiv.appendChild(replaceWithDiv);
            mainDiv.appendChild(submit);

            body.appendChild(mainDiv);
        }


        function handleTopBarMouseDown(e){
            console.log('handling');
            mouseDown = true;
            var div = document.getElementsByClassName('color-picker')[0];
            xCorr = e.pageX - div.offsetLeft;
            yCorr = e.pageY - div.offsetTop;
        }

        function handleTopBarMouseUp(e){
            mouseDown = false;
        }


        
        function handleTopBarMouseMove(e){
            if(mouseDown){
                console.log('moving');
                var div = document.getElementsByClassName('color-picker')[0];
                var x = e.pageX;
                var y = e.pageY;

                div.style.left = (x-xCorr) +'px';
                div.style.top = (y-yCorr) +'px';            
            }
        }



    	    
    }


    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new ColorReplace();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
})();


PhotoEditor.getInstance().addTool(ColorReplace.getInstance());