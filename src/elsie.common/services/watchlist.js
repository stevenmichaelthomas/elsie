angular.module('elsie.common')
.factory('Watchlist', ['$http', '$q', '$mdToast', 'Products', 'Scheduler', 'elsie.session', 'ELSIEAPI', function($http, $q, $mdToast, Products, Scheduler, Session, ELSIEAPI) {

  var cache = {
    lastUpdate: 0,
    watchlist: []
  };

  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id + '/cellar';
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
    $mdToast.showSimple('Syncing your watchlist...'); 
    return $http.put(url(), {
      cellar: cache.watchlist
    }, { timeout: 7500 }).then(function(){
      $mdToast.showSimple('Watchlist synced.'); 
    });
  };

  var watchlistService = {
    load: function() {
      var process = $http.get(url(), { timeout: 5000 }).then(function(res){
        if (!res.data) {
          cache.watchlist = [];
        } else {
          cache.watchlist = res.data;
        }
        return cache.watchlist;
      }, function(err) {
        err.data = 'Error loading your watchlist, please check your connection and try again.';
        return err;
      });
      Scheduler.queue(process);
      return process;
    },
    checkForProduct: function(product){
      var index = JSON.stringify(cache.watchlist).indexOf(product.product_no);
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
        var check = function(p){
          var stub = p + 1;
          if (stub === cache.watchlist.length) {
            cache.lastUpdate = new Date().getTime();
            _syncWatchlist();
            deferred.resolve();
          }
        };
        var update = function(p){
          Products.one(cache.watchlist[p].id).then(function(data){
            cache.watchlist[p] = data;
            check(p);
          });
        };
        for (var p = 0; p < cache.watchlist.length; p++){
          update(p);
        }
      } else {
        _syncWatchlist();
        deferred.resolve();
      }
      return deferred.promise; 
    },
    checkForLegacyWatchlistData: function() {
      if (localStorage["Elsie_watchlistProducts"]){
        var retrievedItmes = JSON.parse(localStorage["Elsie_watchlistProducts"]);
        if (retrievedItmes.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    loadLegacyWatchlistData: function() {
      if (!localStorage["Elsie_watchlistProducts"]) {
        return;
      }
      var localWatchlist = JSON.parse(localStorage["Elsie_watchlistProducts"]);
      return localWatchlist;
    },
    cache: function() {
      return cache.watchlist;
    }
  };
      
  return watchlistService;

}]);