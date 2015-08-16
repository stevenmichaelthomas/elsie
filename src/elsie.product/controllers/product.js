angular.module('elsie.product')
.controller('ProductCtrl', function ($scope, $state, Products, Watchlist) {
  $scope.toggleWatch = function(product){
    var toggle = Watchlist.changeProductStatus(product);
    if (toggle === 'added') {
      $scope.isWatched = true;
    } else if (toggle === 'removed') {
      $scope.isWatched = false;
    }
  };
  (function(){
    $scope.product = Products.selected();
    $scope.image = {
      'background-image': 'url(' + $scope.product.image_url + ')'
    };
    if (Watchlist.checkForProduct($scope.product))
      $scope.isWatched = true;
  })();
});
