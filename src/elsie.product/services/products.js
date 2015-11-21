angular.module('elsie.product')
.factory('Products', function($http, ELSIEAPI, Locator, Dialog, Scheduler) {

  var url = function() {
    return ELSIEAPI;
  };

  var cache = {
    product: {},
    products: [],
    store: {},
    stores: [],
    releases: []
  };
      
  return {
    select: function(item) {
      if (item){
        cache.product = item;
      }
      return;
    },
    selected: function() {
      return cache.product;
    },
    search: function(query) {
      var req = url() + '/products?q=' + query;
      var process = $http.get(req).then(function(response){
        if (response.status === 200){
          cache.products = response.data.result;
          return cache.products;
        } else {
          Dialog.showConnectionError();
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    },
    one: function(id){
      var req = url() + '/products/' + id;
      var process = $http.get(req).then(function(response){
        if (response.status === 200){
          cache.product = response.data.result;
          return cache.product;
        } else {
          Dialog.showConnectionError();
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    },
    atNearbyStores: function(product){
      var req = url() + '/products/' + product.id + '/stores?lat=' + Locator.current().latitude + '&lon=' + Locator.current().longitude;
      var process = $http.get(req).then(function(result){
        if (result.status === 200){
          cache.product = result.data.product;
          cache.product.stores = result.data.result;
          // TODO: if product is in watchlist, update its data
          return cache.product;
        } else {
          Dialog.showConnectionError();
          return {};
        }
      });
      Scheduler.queue(process);
      return process;
    },
    newReleases: function(page) {
      if (!page){
        var pageNumber = 1;
      }
      var req = url() + '/products?order=released_on&per_page=100&page=' + page;
      var process = $http.get(req).then(function(result){
        if (result.status === 200){
          cache.releases = JSON.parse(result.responseText).result;
          return cache.releases;
        } else {
          Dialog.showConnectionError();
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
    }
  };

});