angular.module('elsie.common')
.factory('Navigator', function($state, $history){

  var cache = {
    nextDestination: null,
    nextDirection: null
  };

  return {
    nextDestination: function(){
      return cache.nextDestination;
    },
    nextDirection: function(){
      return cache.nextDirection;
    },
    set: function(destination, direction){
      cache.nextDestination = destination;
      cache.nextDirection = direction;
      return;
    },
    clear: function(){
      cache.nextDestination = null;
      cache.nextDirection = null;
      return;
    },
    go: function(destination, direction){
      this.set(destination, direction);
      $state.go(destination);
      cache.lastState = destination;
      return;
    },
    back: function(value){
      this.set($history.all()[0].state.url, 'back');
      $history.back(value);
      return;
    },
    lastState: function(){
      return cache.lastState;
    },
  };

});