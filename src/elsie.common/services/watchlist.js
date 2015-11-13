angular.module('elsie.common')
.factory('Watchlist', ['$http', '$q', 'Products', 'Scheduler', 'elsie.session', 'ELSIEAPI', function($http, $q, Products, Scheduler, Session, ELSIEAPI) {

  var cache = {
    lastUpdate: 0,
    watchlist: []
  };

  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id + '/';
  };

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

  var _syncWatchlist = function() {
    return $http.put(url(), {
      cellar: JSON.stringify(cache.watchlist)
    });
  };

  var watchlistService = {
    load: function() {
      $http.get(url()).then(function(res){
        if (!res.data.cellar) {
          cache.watchlist = [];
          _syncWatchlist();
        } else {
          cache.watchlist = res.data.cellar;
        }
        return cache.watchlist;
      });
    },
    checkForProduct: function(product){
      var index = JSON.stringify(cache.watchlist).indexOf(JSON.stringify(product.product_no));
      if (index === -1){
        return false;
      } else {
        return true;
      }
    },
    updateProduct: function(product){
      var index;
      for (var p = 0; p < cache.watchlist.length; p++) {
        if (cache.watchlist[p].product_no === product.product_no) {
          index = p;
        }
      }
      cache.watchlist[index] = product;
      return;
    },
    changeProductStatus: function(product){
      var result;
      var index;
      if (!this.checkForProduct(product)){
        cache.watchlist.unshift(product);
        result = "added";
      } else {
        for (var i = 0; i < cache.watchlist.length; i++) {
          if (cache.watchlist[i].product_no === product.product_no) {
            index = i;
          }
        }
        cache.watchlist.splice(index, 1);
        result = "removed";
      }
      _syncWatchlist();
      return result;
    },
    removeSelectedProducts: function (products) {
      for (var i = 0; i < products.length; i++) {
        cache.watchlist.splice(i, 1);
      }
      _syncWatchlist();
      return;
    },
    refreshWatchlistData: function(){
      var deferred = $q.defer();
      if (cache.watchlist.length > 0 && _cacheIsExpired()){
        for (var p = 0; p < cache.watchlist.length; p++){
          Products.atNearbyStores(cache.watchlist[p].id);
        }
        Scheduler.run().then(function(){
          cache.lastUpdate = new Date().getTime();
          deferred.resolve();
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise; 
    }
  };
      
  return watchlistService;

}]);