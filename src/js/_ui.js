(function () {

    "use strict";    
  
    var ui = {};

    ui.initialize = function(){

      /*WinJS.Application.onbackclick = function (evt) {
        console.log('go back');
        WinJS.Navigation.back();
      }*/

      // if we have access to the Windows Runtime, show the statusbar
      if (typeof Windows !== 'undefined') {
        Windows.UI.ViewManagement.StatusBar.getForCurrentView().showAsync();
      }

    	WinJS.UI.processAll().then(function(){
    		WinJS.Navigation.navigate('./home.html');
    	});
    }
    WinJS.Namespace.define("Elsie", {
        Interface: ui
    });
})();