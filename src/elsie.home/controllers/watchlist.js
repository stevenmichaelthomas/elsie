angular.module('elsie.home')
.controller('WatchlistCtrl', function($scope, $timeout, Navigator, Watchlist, Products, Actions) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  $scope.arr = [1, 2, 3];
  var newData = {};
  (function(){
    Actions.transparent(false);
    Actions.set({ title: 'Cellar', menu: false, back: true, search: false, watchlist: false });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $scope.$watch('watchlist',function(a, b, c){
      console.log('$watch change', a, b, c);
    });
    Watchlist.load().then(function(res){
      $scope.watchlist = res.data;
    });
  })();
});