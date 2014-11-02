var ready = function(){
	var searchBox = document.getElementById("searchBoxId");
	searchBox.addEventListener("suggestionsrequested", suggestionsRequestedHandler);
	searchBox.addEventListener("querysubmitted", querySubmittedHandler);

	// winjs init
	WinJS.UI.processAll();

	// cordova init
	app.initialize();
}