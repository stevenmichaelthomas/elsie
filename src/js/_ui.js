var ui = {};

ui.init = function(){
	WinJS.UI.processAll().then(function(){
		WinJS.Navigation.navigate('./home.html');
	});
}