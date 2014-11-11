(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

      /*WinJS.Application.onbackclick = function (evt) {
        console.log('go back');
        WinJS.Navigation.back();
      }*/

    	WinJS.UI.processAll().then(function(){
    		WinJS.Navigation.navigate('./home.html');
    	});
    }
    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();