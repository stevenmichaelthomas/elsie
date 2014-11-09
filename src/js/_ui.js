var ui = {};

ui.init = function(){

  WinJS.Application.onbackclick = function (evt) {
    console.log('go back');
    WinJS.Navigation.back();
  }

	WinJS.UI.processAll().then(function(){
		WinJS.Navigation.navigate('./home.html');
	});
}