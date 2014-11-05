var ui = {};

ui.homeMode = function(){
	if (!data.query){
		document.getElementById("brand").classList.remove("tucked");
		document.getElementById("storeResults").style.display = "none";
	}
}

ui.searchMode = function(){
	if (!data.query){
		document.getElementById("brand").classList.add("tucked");
		document.getElementById("storeResults").style.display = "block";
	}
}

ui.init = function(){
	var searchBox = document.getElementById("searchBoxId");
	searchBox.addEventListener("focus", ui.searchMode, true);
	searchBox.addEventListener("blur", ui.homeMode, true);
	searchBox.addEventListener("suggestionsrequested", search.requestSuggestions);
	searchBox.addEventListener("resultsuggestionchosen", search.selectSuggestion);
	//searchBox.addEventListener("querysubmitted", search.submitQuery);

	ui.build();
}

ui.build = function(){
	WinJS.UI.processAll().then(function(){
		var height = window.innerHeight - 32;
		//document.getElementById("storeResults").style.height = height + "px";
	});
}