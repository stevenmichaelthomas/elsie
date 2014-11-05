var ui = {};

ui.homeMode = function(){
	document.getElementById("brand").className = document.getElementById("brand").className.replace("tucked","");
}

ui.searchMode = function(){
	var d = document.getElementById("brand");
	d.className = d.className + " tucked";
}

ui.init = function(){
	var searchBox = document.getElementById("searchBoxId");
	searchBox.addEventListener("suggestionsrequested", suggestionsRequested);
	searchBox.addEventListener("resultsuggestionchosen", suggestionChosen);
	//searchBox.addEventListener("querysubmitted", querySubmittedHandler);

	ui.build();
}

ui.build = function(){
	WinJS.UI.processAll().then(function(){
		var height = window.innerHeight - 32;
		document.getElementById("storeResults").style.height = height + "px";
	});
}