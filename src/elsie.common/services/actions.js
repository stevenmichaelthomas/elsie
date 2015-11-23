angular.module('elsie.common')
.factory('Actions', function() {

  var cache = {
    show: true,
    set: {
      menu: false,
      back: false
    },
    theme: 'purple',
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
    theme: function(value){
      if (value !== undefined){
        cache.theme = value;
      }
      return cache.theme;
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
    },
    visible: function(){
      return cache.show;
    },
    show: function(){
      cache.show = true;
      return cache.show;
    },
    hide: function(){
      cache.show = false;
      return cache.show;
    }
  };

});