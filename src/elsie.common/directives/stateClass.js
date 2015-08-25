angular.module('elsie.common')
.directive('stateClass', ['$state', '$timeout', 'Navigator', function($state, $timeout, Navigator) {
  return {
    link: function($scope, $element, $attrs) {
      var lastState = Navigator.lastState;
      var movingBackward = Navigator.movingBackward;
      var updateState = function(){
        var classes = $element[0].classList;
        for (var c = classes.length; c > 0; c--){
          if (classes[c]){
            var arr = classes[c].split('-');
            var index = -1;
            if (arr.length > 0){
              index = arr.indexOf('state');
              if (index !== -1){
                $element.removeClass(classes[c]);
              }
            }
          }
        }
        var stateName = $state.current.name || 'init',
        normalizedStateName = 'state-' + stateName.replace(/\./g, '-');
        if (lastState()){
          if (lastState().priority < $state.current.priority){
            $element.addClass('state-higher');
          }
        }
        if ($state.current.name === 'search'){
          $element.addClass('no-animate');
        }
        $element.addClass(normalizedStateName);
      };
      var dealWithOldState = function(event, toState, toParams, fromState, fromParams){
        console.log('newState:');
        console.log(toState);
        console.log('oldState:');
        console.log(fromState);
        if (toState.priority > $state.current.priority){
          var classes = $element[0].classList;
          for (var c = classes.length; c > 0; c--){
            if (classes[c]){
              var arr = classes[c].split('-');
              var index = -1;
              if (arr.length > 0){
                index = arr.indexOf('state-higher');
                if (index !== -1){
                  $element.removeClass(classes[c]);
                }
              }
            }
          }
        }
      };
      $scope.$on('$viewContentLoaded', updateState);
      $scope.$on('$stateChangeStart', dealWithOldState);
    }
  };
}]);