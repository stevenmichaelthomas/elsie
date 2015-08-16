angular.module('elsie.home')
.controller('WatchlistCtrl', function($scope, $state, Watchlist, Products) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      $state.go('product');
    }
  };
  $scope.watchlist = Watchlist.load();
  $scope.productStyle = function(product){
    var style = {
      "background-image": "url('" + product.image_url + "')"
    }
    return style;
  };
});