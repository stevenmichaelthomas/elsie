(function () {
    
    "use strict";

		var services = {};

		services.getLocation = function(){

			var response;

			var onSuccess = function(position) {
				var location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				Elsie.Data.location = location;
			};

			function onError(error) {
				console.log(error);
			}

			navigator.geolocation.getCurrentPosition(onSuccess, onError);

		}

		services.getNearestStores = function(){
			var options = {
				url: 'http://lcboapi.com/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude,
				type: 'GET'
			};
			WinJS.xhr(options).done(
				function (result) {
					Elsie.Data.stores = JSON.parse(result.responseText).result;
					complete();
				}
			);
		}

		services.searchProducts = function(query){
			return new WinJS.Promise(function (complete) {
					var options = {
						url: 'http://lcboapi.com/products?q=' + query,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							Elsie.Data.searchResults = JSON.parse(result.responseText).result;
							complete();
						}
					);
			});
		}

		services.findNearbyStoresWithProduct = function(id){
			// this is a bit redundant
			Elsie.Data.selectedProductId = id;
			
			return new WinJS.Promise(function (complete) {
				if (Elsie.Data.location && Elsie.Data.selectedProductId){
					var options = {
						url: 'http://lcboapi.com/products/' + Elsie.Data.selectedProductId + '/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							var returnedBlob = JSON.parse(result.responseText);
							Elsie.Data.selectedProduct = returnedBlob.product;
							Elsie.Data.nearbyStoresWithProduct = returnedBlob.result;
							complete();
						}
					);
				}
			});
		}

	    WinJS.Namespace.define("Elsie", {
	        Services: services
	    });
})();