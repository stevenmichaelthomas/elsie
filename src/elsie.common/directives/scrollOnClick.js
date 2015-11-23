/* global $ */
angular.module('elsie.common').directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm) {
      $elm.on('click', function() {
        $('body').animate({scrollTop: $($elm).offset().top}, "slow");
      });
    }
  };
});