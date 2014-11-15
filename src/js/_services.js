(function () {
    
    "use strict";

		var services = {};

		services.getLocation = function(){

			console.log('getting location')

			var response;

			var onSuccess = function(position) {
				Elsie.Interface.clearMessage();
				var location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				Elsie.Data.location = location;
			};

			function onError(error) {
				var text = "Elsie couldn't get your location. She won't be able to do much without it, unfortunately.";
				var link = { label: "Retry", action: "getLocation" };
				Elsie.Interface.displayDialog(text, link);
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
			if (!query || query == "") return;
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

		services.storeDetails = function(id){
			// this is a bit redundant
			Elsie.Data.selectedStoreId = id;
			
			return new WinJS.Promise(function (complete) {
				if (Elsie.Data.location && Elsie.Data.selectedProductId){
					var options = {
						url: 'http://lcboapi.com/stores/' + Elsie.Data.selectedStoreId,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							var returnedBlob = JSON.parse(result.responseText);
							Elsie.Data.selectedStore = returnedBlob.result;
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