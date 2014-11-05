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
			data.stores = JSON.parse(result.responseText).result;
			complete(data.stores);
		}
	);
}

services.searchProducts = function(query){
	return new WinJS.Promise(function (complete) {
		if (data.location){
			var options = {
				url: 'http://lcboapi.com/products?q=' + query,
				type: 'GET'
			};
			WinJS.xhr(options).done(
				function (result) {
					data.searchResults = JSON.parse(result.responseText).result;
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
				type: 'GET'
			};
			WinJS.xhr(options).done(
				function (result) {
					data.nearbyStoresWithProduct = JSON.parse(result.responseText).result;
					complete(data.nearbyStoresWithProduct);
				}
			);
		}
	});
}