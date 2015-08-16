angular.module('elsie.product')
.factory('Products', function($http, Location, Scheduler) {

  var url = 'https://lcboapi.com';
  var searchCache = [];
  var searchCacheForStore = [];
  var products = [];
  var selectedProduct = {};
      
  return {
    select: function(product) {
      if (product){
        selectedProduct = product;
      }
      return;
    },
    selected: function() {
      return selectedProduct;
    },
    search: function(query) {
      var process = $http.get(url + '/products?q=' + query).then(function(response){
        if (response.status === 200){
          searchCache = response.data.result;
          return searchCache;
        } else {
          var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
          //Elsie.Interface.showApiError(text);
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    },
    atNearbyStores: function(product){
      var url = url + '/products/' + product.id + '/stores?lat=' + Location.latitude + '&lon=' + Location.longitude;
      var process = $http.get(url).then(function(result){
        if (result.status == 200){
          // get some data back
          selectedProduct = result.data.product;
          selectedProduct.stores = result.data.result;
          // if product is in watchlist, update its data
          return selectedProduct;
        } else {
          var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
          //Elsie.Interface.showApiError(text);
          return {};
        }
      });
      Scheduler.queue(process);
      return process;
    },
    atStore: function(query, store){
      if (!query || query == "") {
        return;
      }
      url = url + '/products?q=' + query + '&store_id=' + store.id;
      var process = $http.get(url).then(function(result){
        if (result.status === 200){
          searchCacheForStore = result.data;
          return searchCacheForStore;
        } else {
          var text = "Elsie couldn't reach the LCBO API. It's possible that you've lost your data connection. Please try again in a few moments.";
          //Elsie.Interface.showApiError(text);
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    }
  }

});