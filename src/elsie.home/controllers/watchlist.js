angular.module('elsie.home')
.controller('WatchlistCtrl', function($scope, $timeout, Navigator, Watchlist, Products, Actions) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  (function(){
    Actions.theme('purple');
    Actions.set({ title: 'Watchlist', menu: false, back: true, search: false, watchlist: false });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $timeout(function(){
      Watchlist.load().then(function(data){
        if (data.status && data.status === -1){
          $scope.watchlist = [];
          $scope.error = data;
          return;
        }
        $scope.watchlist = data;
      });
    }, 500);
  })();
});