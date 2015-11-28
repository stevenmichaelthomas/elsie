/* global $ */
angular.module('elsie.common').directive('scrollPosition', function() {
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, element, attrs) {
      var handler = function() {
        scope.scroll = $(element).scrollTop();
      };
      element.on('scroll', scope.$apply.bind(scope, handler));
      handler();
    }
  };
});