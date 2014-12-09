(function () {
    
    "use strict";

		var services = {};

		services.initializeLocation = function(){
			if (!localStorage["Elsie_cachedLocation"]){
				var location = {
					latitude: "43.656025",
					longitude: "-79.380257"
				};
				Elsie.Data.location = location;
				localStorage["Elsie_cachedLocation"] = JSON.stringify(location);
			} else {
				Elsie.Data.location = JSON.parse(localStorage["Elsie_cachedLocation"]);
			}
		}

		services.getLocation = function(){
			return new WinJS.Promise(function (complete) {
				
				Elsie.Interface.showLoadingAnimation("Getting your location...");

				var response;
				var onSuccess = function(position) {
					Elsie.Interface.hideLoadingAnimation();
					var location = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
					Elsie.Data.location = location;
					localStorage["Elsie_cachedLocation"] = JSON.stringify(location);
					complete();
				};
				var onError = function() {
					Elsie.Interface.hideLoadingAnimation();
					var text = "Elsie couldn't get your location. She won't be able to provide you with accurate information until she has it.";
					var link = { label: "Retry", action: "getLocation" };
					Elsie.Interface.showLocationError(text, link);
				}

				navigator.geolocation.getCurrentPosition(onSuccess, onError);

			});
		}

		services.getNearbyStoresForProduct = function(location){
			return new WinJS.Promise(function (complete) {
				var makeCall = function(){
					var options = {
						url: 'http://lcboapi.com/stores?lat=' + location.latitude + '&lon=' + location.longitude,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200) {
								Elsie.Data.nearbyStores = JSON.parse(result.responseText).result;
								Elsie.Data.nearbyStores.shift();
								var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStores);
	            Elsie.Lists.nearbyStores = itemList;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
							}
						}
					);
				};
				if (Elsie.Data.location && Object.keys(Elsie.Data.location).length > 0) {
					makeCall();
				} else {
					services.getLocation().then(makeCall);
				}
			});
		}

		services.getClosestStores = function(){
			return new WinJS.Promise(function (complete) {
				var makeCall = function(){
					var options = {
						url: 'http://lcboapi.com/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200) {
								Elsie.Data.closestStores = JSON.parse(result.responseText).result;
								var itemList = new WinJS.Binding.List(Elsie.Data.closestStores);
	            Elsie.Lists.closestStores = itemList;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
							}
						}
					);
				};
				if (Elsie.Data.location && Object.keys(Elsie.Data.location).length > 0) {
					makeCall();
				} else {
					services.getLocation().then(makeCall);
				}
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
							if (result.status === 200){
								Elsie.Data.searchResults = JSON.parse(result.responseText).result;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
							}
						}
					);
			});
		}

		services.querySimilarProducts = function(query){
			return new WinJS.Promise(function (complete) {
					if (!query || query == "") {
						Elsie.Data.similarProducts = [];
						var itemList = new WinJS.Binding.List(Elsie.Data.similarProducts);
	         Elsie.Lists.similarProducts = itemList;
						complete();
						return;
					}
					var options = {
						url: 'http://lcboapi.com/products?q=' + query,
						type: 'GET'
					};
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200){
								Elsie.Data.similarProducts = JSON.parse(result.responseText).result;
								Elsie.Data.similarProducts = Elsie.Data.similarProducts.slice(0,6);
								var itemList = new WinJS.Binding.List(Elsie.Data.similarProducts);
	            Elsie.Lists.similarProducts = itemList;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
							}
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

					var makeCall = function(){
						var options = {
							url: 'http://lcboapi.com/products/' + Elsie.Data.selectedProductId + '/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude,
							type: 'GET'
						};
						WinJS.xhr(options).done(
							function (result) {
								if (result.status == 200){
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
									var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStoresWithProduct);
									Elsie.Lists.nearbyStoresWithProduct = itemList;
									services.getRecentProducts();
									complete();
								} else {
									var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
									Elsie.Interface.showApiError(text);
								}
							}
						);
					};

					if (Elsie.Data.location && Object.keys(Elsie.Data.location).length > 0) {
						makeCall();
					} else {
						services.getLocation().then(makeCall);
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
							if (result.status === 200) {
								var returnedBlob = JSON.parse(result.responseText);
								Elsie.Data.selectedStore = returnedBlob.result;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
							}
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