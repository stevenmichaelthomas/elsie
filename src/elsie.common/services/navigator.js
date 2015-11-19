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
      console.log('state ' + $state.current.name + ' saved');
      $state.go(destination);
    },
    back: function(){
      cache.movingBackward = true;
      var stack = $history.all();
      cache.lastState = $state.current;
      if (stack[stack.length - 2].state.name === $state.current.name){
        $state.go('home');
      } else {
        $history.back();
      }
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