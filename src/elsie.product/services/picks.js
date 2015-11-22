angular.module('elsie.product')
.factory('Picks', function($http, $q, ELSIEAPI, Locator, Dialog, Scheduler) {

  var url = function() {
    return ELSIEAPI;
  };

  var cache = {
    picks: [],
    picksHash: {}
  };
      
  return {
    latest: function(){
      var deferred = $q.defer();
      if (cache.picks.length === 0){
        var req = url() + '/picks?sort=id%20DESC';
        var process = $http.get(req).then(function(result){
          if (result.status === 200){
            cache.picks = result.data.slice(0,5);
            angular.forEach(cache.picks, function(p,i){
              cache.picksHash[p.productNumber] = p;
            });
            deferred.resolve(cache.picks);
          } else {
            Dialog.showConnectionError();
            return [];
          }
        });
        Scheduler.queue(process);
      } else {
        deferred.resolve(cache.picks);
      }
      return deferred.promise;
    },
    all: function(){
      var deferred = $q.defer();
      if (cache.picks.length === 0){
        var req = url() + '/picks?sort=id%20DESC';
        var process = $http.get(req).then(function(result){
          if (result.status === 200){
            cache.picks = result.data;
            angular.forEach(cache.picks, function(p,i){
              cache.picksHash[p.productNumber] = p;
            });
            deferred.resolve(cache.picks);
          } else {
            Dialog.showConnectionError();
            return [];
          }
        });
        Scheduler.queue(process);
      } else {
        deferred.resolve(cache.picks);
      }
      return deferred.promise;
    },
    one: function(){
      return cache.picks[0];
    },
    check: function(product){
      if (cache.picksHash[product.id]){
        return cache.picksHash[product.id];
      } else {
        return {};
      }
    }
  };

});