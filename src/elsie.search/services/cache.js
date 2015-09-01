angular.module('elsie.search')
.factory('Cache', function($http, LCBOAPI) {

  var cache = {
    products: [],
    stores: [],
    mode: 'product'
  };
      
  return {
    update: function(cacheObject){
      cache = cacheObject;
      return;
    },
    get: function(){
      return cache;
    }
  };

});