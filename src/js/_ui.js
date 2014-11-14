(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

    	WinJS.UI.processAll().then(function(){
    		WinJS.Navigation.navigate('./home.html');
    	});
    }
    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();