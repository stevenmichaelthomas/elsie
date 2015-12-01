angular.module('elsie.core')
.controller('PicksCtrl', ['$scope', '$timeout', 'Navigator', 'Picks', 'Products', 'Actions', 'elsie.session',
  function($scope, $timeout, Navigator, Picks, Products, Actions, Session) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  (function(){
    Actions.theme('purple');
    Actions.set({ title: 'kwäf Picks', menu: false, back: true, search: false, watchlist: false });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $timeout(function(){
      Picks.all().then(function(picks){
        $scope.picks = [];
        angular.forEach(picks, function(p, i){
          Products.one(p.productNumber).then(function(one){
            one.pick = p;
            $scope.picks.push(one);
            if (i + 1 === picks.length) {
              $scope.loaded = true;
            }
          });
        });
      }); // Picks.all
    }, 350);  
  })();
}]);