angular.module('elsie.search')
.factory('Cache', function($http, LCBOAPI) {

  var cache = {
    products: [],
    stores: [],
    mode: 'products',
    active: false
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