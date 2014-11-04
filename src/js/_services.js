var services = {};
var data = {};

services.getLocation = function(){

	var response;

	var onSuccess = function(position) {
		var location = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		};
		data.location = location;
	};

	function onError(error) {
		//error
	}

	navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

services.getNearestStores = function(){
	var options = {
		url: 'http://lcboapi.com/stores?lat=' + data.location.latitude + '&lon=' + data.location.longitude,
		type: 'GET'
	};
	WinJS.xhr(options).done(
	    function (result) {
			data.stores = result.result;
			services.getNearestStores();
		},
		function (result) {
			//error
		}
	);
}

services.searchProducts = function(query){
	return new WinJS.Promise(function (complete) {
		if (data.location){
			var options = {
				url: 'http://lcboapi.com/products?q=' + query,
				type: 'GET',
				responseType: 'json'
			};
			WinJS.xhr(options).done(
				function (result) {
					var json = result.response;
					data.searchResults = json.result;
					complete(data.searchResults);
				}
			);
		}
	});
}

services.findNearbyStoresWithProduct = function(id){
	data.selectedProduct = id;
	return new WinJS.Promise(function (complete) {
		if (data.location && data.selectedProduct){
			var options = {
				url: 'http://lcboapi.com/products/' + data.selectedProduct + '/stores?lat=' + data.location.latitude + '&lon=' + data.location.longitude,
				type: 'GET',
				responseType: 'json'
			};
			WinJS.xhr(options).done(
				function (result) {
					var json = result.response;
					data.nearbyStoresWithProduct = json.result;
					complete(data.searchResults);
				}
			);
		}
	});
}

services.bootstrapUI = function(){
	var searchBox = document.getElementById("searchBoxId");
	searchBox.addEventListener("suggestionsrequested", suggestionsRequested);
	searchBox.addEventListener("resultsuggestionchosen", suggestionChosen);
	//searchBox.addEventListener("querysubmitted", querySubmittedHandler);

	services.processUI();
}

services.processUI = function(){
	WinJS.UI.processAll().then(function(){
		var height = window.innerHeight - 32;
		//var width = window.innerWidth - 20;
		document.getElementById("storeResults").style.height = height + "px";
		//document.getElementById("searchBoxId").style.width = width + "px";
	});
}