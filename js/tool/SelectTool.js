var SelectTool = (function(){
       

    function SelectTool() {
        var name='select';
        var iconSrc = 'images/icons/select.png';    //source for icon file
        
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

    //this approach is used to make class singleton
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

//register tool in PhotoEditor tools
PhotoEditor.getInstance().addTool(SelectTool.getInstance());