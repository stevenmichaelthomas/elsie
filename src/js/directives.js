angular.module('elsie.directives', [])
.directive('stateClass', ['$state', function($state) {
  return {
    link: function($scope, $element, $attrs) {
      var stateName = $state.current.name || 'init',
        normalizedStateName = 'state-' + stateName.replace(/\./g, '-');
      $element.addClass(normalizedStateName);
    }
  }
}]);