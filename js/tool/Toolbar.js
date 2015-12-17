
var Toolbar = (function(){
    function Toolbar() {
    	var tools = [];

		this.addTool = function(tool){
			tools.push(tool);
		}    

		this.getTool = function(){
			return tools;
		}
    }


    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new Toolbar();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
})();


// Toolbar.getInstance().addTool(SelectTool.getInstance());