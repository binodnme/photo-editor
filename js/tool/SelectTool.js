
var SelectTool = (function(){
    var iconSrc = 'images/icons/select.png';   //source for icon file

    function SelectTool() {
        var name='select';
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
    	    
    }


    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new SelectTool();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
})();


PhotoEditor.getInstance().addTool(SelectTool.getInstance());