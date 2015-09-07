angular.module('elsie.product')
.factory('Picks', function($http, ELSIEAPI, Locator, Dialog, Scheduler) {

  var url = function() {
    return ELSIEAPI;
  };

  var cache = {
    picks: [],
    picksHash: {}
  };
      
  return {
    latest: function(){
      var req = url() + '/picks?sort=id%20DESC';
      var process = $http.get(req).then(function(result){
        if (result.status === 200){
          cache.picks = result.data;
          angular.forEach(cache.picks, function(p,i){
            cache.picksHash[p.productNumber] = p;
          });
          return cache.picks;
        } else {
          Dialog.showConnectionError();
          return [];
        }
      });
      Scheduler.queue(process);
      return process;
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