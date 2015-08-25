angular.module('elsie.common')
.factory('Actions', function() {

  var cache = {
    set: {},
    transparent: false,
    search: false,
    backGoesHome: false
  };

  return {
    set: function(items){
      cache.set = items;
    },
    get: function(){
      return cache.set;
    },
    transparent: function(value){
      if (value !== undefined){
        cache.transparent = value;
      }
      return cache.transparent;
    },
    search: function(value){
      if (value !== undefined){
        cache.search = value;
      }
      return cache.search;
    },
    backGoesHome: function(value){
      if (value !== undefined){
        cache.backGoesHome = value;
      }
      return cache.backGoesHome;
    }
  };

});