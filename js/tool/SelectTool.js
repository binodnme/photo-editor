
var SelectTool = (function(){
    var iconSrc = '';   //source for icon file

    function SelectTool() {
        var name='select';
        // var 

        
        this.getName = function(){
            return name;
        }

        this.getIconSrc = function(){
            return iconSrc;
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