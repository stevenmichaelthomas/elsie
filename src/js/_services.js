var services = {};
var data = {};

services.getLocation = function(){

	var response;

	var onSuccess = function(position) {
	    /*console.log('Latitude: '          + position.coords.latitude          + '\n' +
	          'Longitude: '         + position.coords.longitude         + '\n' +
	          'Altitude: '          + position.coords.altitude          + '\n' +
	          'Accuracy: '          + position.coords.accuracy          + '\n' +
	          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
	          'Heading: '           + position.coords.heading           + '\n' +
	          'Speed: '             + position.coords.speed             + '\n' +
	          'Timestamp: '         + position.timestamp                + '\n');*/
	    var location = {
	    	latitude: position.coords.latitude,
	    	longitude: position.coords.longitude
	    };
	    data.location = location;
	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
	    console.log('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	    response = null;
	}

	navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

services.returnLocation = function(){
	return data.location;
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

    // winjs init
    WinJS.UI.processAll();
}