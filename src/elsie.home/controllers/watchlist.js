angular.module('elsie.home')
.controller('WatchlistCtrl', function($scope, Navigator, Watchlist, Products) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  $scope.watchlist = Watchlist.load();
  $scope.productStyle = function(product){
    var style = {
      "background-image": "url('" + product.image_url + "')"
    };
    return style;
  };
});