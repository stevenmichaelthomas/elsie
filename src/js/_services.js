(function () {
    
    "use strict";

		var services = {};
		var processes = [];
		var options = {
			type: 'GET',
			headers: {
				"Authorization": "Token " + Keys.LCBO_API
    	}
		};

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

		services.updateRunNumber = function(){
			if (!localStorage["Elsie_numberOfRuns"]){
				Elsie.Data.runNumber = 1;
				localStorage["Elsie_numberOfRuns"] = 1;
			} else {
				var existingNumber = parseInt(localStorage["Elsie_numberOfRuns"]);
				var newNumber = existingNumber + 1;
				Elsie.Data.runNumber = newNumber;
				localStorage["Elsie_numberOfRuns"] = newNumber;
			}
		}

		services.getLocation = function(){
			var promise = new WinJS.Promise(function (complete) {
				
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
					complete();
				}

				navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 6500 });
			});
			processes.push(promise);
			return promise;
		}

		services.getNearbyStoresForProduct = function(location){
			return new WinJS.Promise(function (complete) {
				var makeCall = function(){
					options.url = 'https://lcboapi.com/stores?lat=' + location.latitude + '&lon=' + location.longitude;
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
								complete();
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
			var promise = new WinJS.Promise(function (complete) {
				var makeCall = function(){
					options.url = 'https://lcboapi.com/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude;
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
								complete();
							}
						}
					);
				};
				WinJS.Promise.join(processes).done(function(){
					makeCall();
				});
			});
			processes.push(promise);
			return promise;
		}

		services.getNewReleases = function(page){
			if (!page){
				var pageNumber = 1;
			}
			var promise = new WinJS.Promise(function (complete) {
				var makeCall = function(){
					options.url = 'https://lcboapi.com/products?order=released_on&per_page=100&page=' + pageNumber;
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200) {
								Elsie.Data.newReleases = JSON.parse(result.responseText).result;
								var itemList = new WinJS.Binding.List(Elsie.Data.newReleases);
	            Elsie.Lists.newReleases = itemList;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
								complete();
							}
						}
					);
				};
				WinJS.Promise.join(processes).done(function(){
					makeCall();
				});
			});
			processes.push(promise);
			return promise;
		}

		services.searchProducts = function(query){
			return new WinJS.Promise(function (complete) {
					if (!query || query == "") {
						if (Elsie.Data.searchResults)
							Elsie.Data.searchResults.length = 0;
						complete();
						return;
					}
					options.url = 'https://lcboapi.com/products?q=' + query;
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200){
								Elsie.Data.searchResults = JSON.parse(result.responseText).result;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
								complete();
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
					options.url = 'https://lcboapi.com/products?q=' + query;
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200){
								Elsie.Data.similarProducts = JSON.parse(result.responseText).result;
								Elsie.Data.similarProducts = Elsie.Data.similarProducts.slice(0,8);
								var itemList = new WinJS.Binding.List(Elsie.Data.similarProducts);
								Elsie.Lists.similarProducts = itemList;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
								complete();
							}
						}
					);
			});
		}

		services.getRecentProducts = function(){
			if (localStorage["Elsie_recentProducts"]){
			 	var retrievedItmes = JSON.parse(localStorage["Elsie_recentProducts"]);
			 	retrievedItmes.reverse();
			 	retrievedItmes = retrievedItmes.slice(0,10);
	    	Elsie.Data.recentProducts = retrievedItmes;
   		}
		};

		services.toggleProductSelection = function (item, listView) {
			if (listView.winControl){
				//console.log(item);
				var items = listView.winControl.selection.getItems()._value;
				var inArray = false;
				//console.log(items);
				for (var i = 0; i < items.length; i++) {
					if (items[i].index === item)
						inArray = true;
				}
				if (inArray){
					listView.winControl.selection.remove(item);
				} else {
					listView.winControl.selection.add(item);
				}
			}
		};

		services.removeSelectedRecentProducts = function (listView) {
      if (listView.winControl){
        var indices = listView.winControl.selection.getIndices().sort(function(a,b){return a-b});
        for (var j = indices.length - 1; j >= 0; j--) {
            Elsie.Lists.recentProducts.splice(indices[j], 1);
            Elsie.Data.recentProducts.splice(indices[j], 1);
        }
        services.syncRecents();
      }
    };

    services.syncRecents = function(){
			localStorage["Elsie_recentProducts"] = JSON.stringify(Elsie.Data.recentProducts);
		};

		services.findProductAtStore = function(query, storeId){
			return new WinJS.Promise(function (complete) {
					if (!query || query == "") {
						Elsie.Data.storeInventoryQuery.length = 0;
						complete();
						return;
					}
					options.url = 'https://lcboapi.com/products?q=' + query + '&store_id=' + storeId;
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200){
								Elsie.Data.storeInventoryQuery = JSON.parse(result.responseText).result;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
								complete();
							}
						}
					);
			});
		}

		services.findNearbyStoresWithProduct = function(id, isUPC){

			delete Elsie.Data.selectedProduct;
			delete Elsie.Data.selectedProductId;

			// this is a bit redundant
			if (!isUPC)
				Elsie.Data.selectedProductId = id;
			
			var promise = new WinJS.Promise(function (complete) {

					if (isUPC){
						// have to set Elsie.Data.selectedProductId
						var url = 'https://lcboapi.com/products/' + id + '/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude;
					} else {
						var url = 'https://lcboapi.com/products/' + Elsie.Data.selectedProductId + '/stores?lat=' + Elsie.Data.location.latitude + '&lon=' + Elsie.Data.location.longitude;
					}

					var makeCall = function(){
						options.url = url;
						WinJS.xhr(options).done(
							function (result) {
								if (result.status == 200){
									
									// get some data back
									var returnedBlob = JSON.parse(result.responseText);
									Elsie.Data.selectedProductWithStores = returnedBlob.product;
									Elsie.Data.selectedProductWithStores.stores = returnedBlob.result;
									Elsie.Data.selectedProduct = returnedBlob.product;		
									Elsie.Data.selectedProductId = returnedBlob.product.id;					
									Elsie.Data.nearbyStoresWithProduct = returnedBlob.result;

									// recents handling
									if (localStorage["Elsie_recentProducts"]){
										var favouriteProducts = JSON.parse(localStorage["Elsie_recentProducts"]);
										var checkForProduct = JSON.stringify(favouriteProducts).indexOf(JSON.stringify(returnedBlob.product.name));
										if (checkForProduct == -1){
											favouriteProducts.push(Elsie.Data.selectedProduct);
											localStorage["Elsie_recentProducts"] = JSON.stringify(favouriteProducts);
										} else {
											// product was already in recents
											var index = favouriteProducts.map(function(product, index) {
												if(product.product_no === Elsie.Data.selectedProduct.product_no) {
														return index;
												}
											}).filter(isFinite);
											favouriteProducts.splice(index, 1);
											favouriteProducts.push(Elsie.Data.selectedProduct);
											localStorage["Elsie_recentProducts"] = JSON.stringify(favouriteProducts);
										}
									} else {
										var favouriteProducts = [];
										favouriteProducts.push(Elsie.Data.selectedProduct);
										localStorage["Elsie_recentProducts"] = JSON.stringify(favouriteProducts);
									}

									// if product is in watchlist, update its data
									if (services.checkWatchlistForProduct(Elsie.Data.selectedProduct)){
										var index;
										for (var p = 0; p < Elsie.Data.watchlistProducts.length; p++) {
										  if (Elsie.Data.watchlistProducts[p].product_no === Elsie.Data.selectedProduct.product_no) {
										      index = p;
										  }
										}
										Elsie.Data.watchlistProducts[index] = Elsie.Data.selectedProductWithStores;
									}

									// finish up
									var itemList = new WinJS.Binding.List(Elsie.Data.nearbyStoresWithProduct);
									Elsie.Lists.nearbyStoresWithProduct = itemList;
									services.getRecentProducts();
									complete();
								} else {
									var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
									Elsie.Interface.showApiError(text);
									complete();
								}
							}, function(error) {
								var error = JSON.parse(error.response).message;
								Elsie.Interface.showApiError(error);
								complete();
							}
						);
					};

					WinJS.Promise.join(processes).done(function(){
						makeCall();
					});

			});
			promise.type = 'findNearbyStoresWithProduct';
			processes.push(promise);
			return promise;
		}

		services.cancelProcessesByType = function(type) {
			return new WinJS.Promise(function(complete){
				for (var process = 0; process < processes.length; process++){
					if (processes[process].type === type){
						processes[process].cancel();
					}
				}
				complete();
			});
 		}

		services.storeDetails = function(id){
			// this is a bit redundant
			Elsie.Data.selectedStoreId = id;
			
			return new WinJS.Promise(function (complete) {
				if (Elsie.Data.location && Elsie.Data.selectedProductId){
					options.url = 'https://lcboapi.com/stores/' + Elsie.Data.selectedStoreId;
					WinJS.xhr(options).done(
						function (result) {
							if (result.status === 200) {
								var returnedBlob = JSON.parse(result.responseText);
								Elsie.Data.selectedStore = returnedBlob.result;
								complete();
							} else {
								var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
								Elsie.Interface.showApiError(text);
								complete();
							}
						}
					);
				}
			});
		};

		services.loadWatchlist = function(){
			if (localStorage["Elsie_watchlistProducts"]){
			 	var retrievedItmes = JSON.parse(localStorage["Elsie_watchlistProducts"]);
			 	retrievedItmes.reverse();
	    	Elsie.Data.watchlistProducts = retrievedItmes;
   		} else {
   			Elsie.Data.watchlistProducts = [];
   			services.syncWatchlist();
   		}
		};

		services.checkWatchlistForProduct = function(product){
			var index = JSON.stringify(Elsie.Data.watchlistProducts).indexOf(JSON.stringify(product.product_no));
			if (index === -1){
				return false;
			} else {
				return true;
			}
		};

		services.changeProductWatchStatus = function(product){
			var result;
			var index;
			var isWatched = JSON.stringify(Elsie.Data.watchlistProducts).indexOf(JSON.stringify(product.product_no));
			if (isWatched === -1){
				Elsie.Data.watchlistProducts.push(product);
				result = "added";
			} else {
				for (var i = 0; i < Elsie.Data.watchlistProducts.length; i++) {
				  if (Elsie.Data.watchlistProducts[i].product_no === product.product_no) {
				      index = i;
				  }
				}
				Elsie.Data.watchlistProducts.splice(index, 1);
				result = "removed";
			}
			services.syncWatchlist();
			return result;
		};

		services.removeSelectedWatchedProducts = function (listView) {
		  if (listView.winControl){
		    var indices = listView.winControl.selection.getIndices().sort(function(a,b){return a-b});
		    for (var j = indices.length - 1; j >= 0; j--) {
		        Elsie.Lists.watchlistProducts.splice(indices[j], 1);
		        Elsie.Data.watchlistProducts.splice(indices[j], 1);
		    }
		    services.syncWatchlist();
		  }
		};

		services.refreshWatchlistData = function(){
			return new WinJS.Promise(function (complete) {
				if (Elsie.Data.watchlistProducts.length > 0 && services.cacheIsExpired()){
					for (var p = 0; p < Elsie.Data.watchlistProducts.length; p++){
						services.findNearbyStoresWithProduct(Elsie.Data.watchlistProducts[p].id);
					}
					WinJS.Promise.join(processes).done(function(){
						var itemList = new WinJS.Binding.List(Elsie.Data.watchlistProducts);
						Elsie.Lists.watchlistProducts = itemList;
						Elsie.Data.lastWatchlistRefresh = new Date().getTime();
						complete();
					});
				} else {
					complete();
				}
			});	
		};

		services.cacheIsExpired = function() {
			if (!Elsie.Data.lastWatchlistRefresh) {
				return true;
			}
			var now = new Date().getTime();
			var delta = now - Elsie.Data.lastWatchlistRefresh;
			if (delta >= 600000){
				return true;
			} else {
				return false;
			}
		};

		services.syncWatchlist = function(){
			localStorage["Elsie_watchlistProducts"] = JSON.stringify(Elsie.Data.watchlistProducts);
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