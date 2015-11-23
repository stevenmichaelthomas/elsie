angular.module('elsie.common')
.directive('watchScroll', ['$timeout', function($timeout) {
  return {
    link: function($scope, $element, $attrs) {
      (function(){
        $timeout(function(){
          var el = $element[0].querySelector('.md-virtual-repeat-scroller');
          var products = document.querySelectorAll('.product');
          el.addEventListener('scroll', function(){
            for (var i = 0; i < products.length; i++){
              //console.log(products[i]);
              if (verge.inViewport(products[i]), -300) {
                console.log('we can see you:');
                console.log(products[i]);
              }
            }
          });
        },200);
      })();
    }
  };
}]);