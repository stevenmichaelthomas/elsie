angular.module('elsie.common')
.factory('Navigator', function($state, $history){

  var cache = {
    lastState: null,
    movingBackward: false
  };

  return {
    go: function(destination){
      cache.movingBackward = false;
      cache.lastState = $state.current;
      $state.go(destination);
    },
    back: function(){
      cache.movingBackward = true;
      cache.lastState = $state.current;
      $history.back();
      return;
    },
    movingBackward: function(){
      return cache.movingBackward;
    },
    lastState: function(){
      return cache.lastState;
    },
  };

});