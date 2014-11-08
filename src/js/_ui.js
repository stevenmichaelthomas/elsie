var ui = {};

ui.init = function(){
	WinJS.UI.processAll().then(function(){
		WinJS.Navigation.navigate('./home.html');
	});
  window.addEventListener('keyup', backButtonGlobalKeyUpHandler, false)
  var KEY_LEFT = "Left";
  var KEY_BROWSER_BACK = "BrowserBack";
  var MOUSE_BACK_BUTTON = 3;
  function backButtonGlobalKeyUpHandler(event) {
        // Navigates back when (alt + left) or BrowserBack keys are released.
        if ((event.key === KEY_LEFT && event.altKey && !event.shiftKey && !event.ctrlKey) || (event.key === KEY_BROWSER_BACK)) {
            nav.back();
        }
    }
}