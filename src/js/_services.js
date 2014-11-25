(function () {
    
    "use strict";

		var services = {};

		services.getLocation = function(){

			Elsie.Interface.showLoadingAnimation("Getting your location...");

			var response;

			var onSuccess = function(position) {
				Elsie.Interface.hideLoadingAnimation();
				var location = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				};
				Elsie.Data.location = location;
			};

			function onError(error) {
				Elsie.Interface.hideLoadingAnimation();
				var text = "Elsie couldn't get your location. She won't be able to provide you with accurate information until she has it.";
				var link = { label: "Retry", action: "getLocation" };
				Elsie.Interface.displayDialog(text, link);
			}

			navigator.geolocation.getCurrentPosition(onSuccess, onError);

		}

		services.getNearbyStoresForProduct = function(location){
			return new WinJS.Promise(function (complete) {
					var options = {
						url: 'http://lcboapi.com/stores?lat=' + location.latitude + '&lon=' + location.longitude,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							Elsie.Data.nearbyStores = JSON.parse(result.responseText).result;
							Elsie.Data.nearbyStores.shift();
							complete();
						}
					);
			});
		}

		services.getClosestStores = function(){
			return new WinJS.Promise(function (complete) {
					var options = {
						url: 'http://lcboapi.com/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							Elsie.Data.closestStores = JSON.parse(result.responseText).result;
							complete();
						}
					);
			});
		}

		services.searchProducts = function(query){
			return new WinJS.Promise(function (complete) {
					if (!query || query == "") {
						Elsie.Data.searchResults.length = 0;
						complete();
						return;
					}
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

		services.getRecentProducts = function(){
			if (localStorage["Elsie_recentProducts"]){
			 	var retrievedItmes = JSON.parse(localStorage["Elsie_recentProducts"]);
			 	retrievedItmes.reverse();
	    	Elsie.Data.recentProducts = retrievedItmes;
   		}
		};

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

							if (localStorage["Elsie_recentProducts"]){
								var favouriteProducts = JSON.parse(localStorage["Elsie_recentProducts"]);
								//favouriteProducts.shift();
								var checkForProduct = JSON.stringify(favouriteProducts).indexOf(JSON.stringify(returnedBlob.product.name));
								if (checkForProduct == -1){
									favouriteProducts.push(Elsie.Data.selectedProduct);
									localStorage["Elsie_recentProducts"] = JSON.stringify(favouriteProducts);
								}
							} else {
								var favouriteProducts = [];
								favouriteProducts.push(Elsie.Data.selectedProduct);
								localStorage["Elsie_recentProducts"] = JSON.stringify(favouriteProducts);
							}
							services.getRecentProducts();
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
		};

		services.contains = function(obj, array){
			var i;
			for (i = 0; i < array.length; i++) {
			  if (array[i] === obj) {
			      return true;
			  }
			}

			return false;
		};

    WinJS.Namespace.define("Elsie", {
        Services: services
    });
})();