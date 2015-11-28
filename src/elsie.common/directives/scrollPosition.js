/* global $ */
angular.module('elsie.common').directive('scrollPosition', function(Bump) {
  return {
    scope: {
      scroll: '=scrollPosition'
    },
    link: function(scope, element, attrs) {
      var handler = function() {
        var scrollVal = element[0].getBoundingClientRect().top - Bump;
        scope.scroll = -scrollVal;
      };
      var parent = document.getElementById(attrs.scrollParent);
      angular.element(parent).on('scroll', scope.$apply.bind(scope, handler));
      handler();
    }
  };
});