angular.module('elsie.common')
.factory('Watchlist', function($http, Products, Scheduler) {

  var cache = {
    lastUpdate: 0
  };  
  var watchlist = [];

  var _cacheIsExpired = function() {
    if (cache.lastUpdate === 0) {
      return true;
    }
    var now = new Date().getTime();
    var delta = now - cache.lastUpdate;
    if (delta >= 600000){
      return true;
    } else {
      return false;
    }
  };

  var _syncWatchlist = function(){
    localStorage["Elsie_watchlistProducts"] = JSON.stringify(watchlist);
    return;
  };

  var watchlistService = {
    load: function(){
      if (watchlist.length === 0){
        if (localStorage["Elsie_watchlistProducts"]){
          var retrievedItmes = JSON.parse(localStorage["Elsie_watchlistProducts"]);
          retrievedItmes.reverse();
          watchlist = retrievedItmes;
        } else {
          _syncWatchlist();
        }
      }
      return watchlist;
    },
    checkForProduct: function(product){
      var index = JSON.stringify(watchlist).indexOf(JSON.stringify(product.product_no));
      if (index === -1){
        return false;
      } else {
        return true;
      }
    },
    updateProduct: function(product){
      var index;
      for (var p = 0; p < watchlist.length; p++) {
        if (watchlist[p].product_no === product.product_no) {
          index = p;
        }
      }
      watchlist[index] = product;
      return;
    },
    changeProductStatus: function(product){
      var result;
      var index;
      if (!this.checkForProduct(product)){
        watchlist.push(product);
        result = "added";
      } else {
        for (var i = 0; i < watchlist.length; i++) {
          if (watchlist[i].product_no === product.product_no) {
            index = i;
          }
        }
        watchlist.splice(index, 1);
        result = "removed";
      }
      _syncWatchlist();
      return result;
    },
    removeSelectedProducts: function (products) {
      for (var i = 0; i < products.length; i++) {
        watchlist.splice(i, 1);
      }
      _syncWatchlist();
      return;
    },
    refreshWatchlistData: function(){
      var deferred = $q.defer();
      if (watchlist.length > 0 && _cacheIsExpired()){
        for (var p = 0; p < watchlist.length; p++){
          Products.atNearbyStores(watchlist[p].id);
        }
        Scheduler.run().then(function(){
          cache.lastUpdate = new Date().getTime();
          deferred.resolve();
        });
      } else {
        deferred.resolve();
      };
      return deferred.promise; 
    }
  };
      
  return watchlistService;

});