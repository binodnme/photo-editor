
var SelectTool = (function(){
    function SelectTool() {
        var name='select';
        // var 

        
        this.getName = function(){
            return name;
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


Photoshop.getInstance().addTool(SelectTool.getInstance());