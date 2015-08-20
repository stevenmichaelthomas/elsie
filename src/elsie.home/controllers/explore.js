angular.module('elsie.home')
.controller('ExploreCtrl', function($scope, $state, Watchlist, Products) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      $state.go('product');
    }
  };
  $scope.loadMalbec = function(){
    Products.one(478727).then(function(res){
      Products.select(res);
      $state.go('product');
    });
  };
  $scope.watchlist = Watchlist.load();
});