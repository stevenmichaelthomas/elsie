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
        $element.addClass(normalizedStateName);
      };
      $scope.$on('$viewContentLoaded', updateState);
    }
  };
}]);