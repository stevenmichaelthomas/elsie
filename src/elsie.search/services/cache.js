angular.module('elsie.search')
.factory('Cache', function($http, LCBOAPI) {

  var cache = {
    products: [],
    stores: [],
    mode: 0,
    active: false,
    query: ''
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