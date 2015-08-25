angular.module('elsie.home')
.controller('ExploreCtrl', function($scope, Navigator, Watchlist, Products) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product');
    }
  };
  $scope.loadMalbec = function(){
    Products.one(478727).then(function(res){
      Products.select(res);
      Navigator.go('product');
    });
  };
  $scope.watchlist = Watchlist.load();
});