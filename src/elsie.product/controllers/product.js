angular.module('elsie.product')
.controller('ProductCtrl', ['$scope', '$state', 'Products', 'Watchlist', 'Actions', function ($scope, $state, Products, Watchlist, Actions) {
  $scope.toggleWatch = function(product){
    var toggle = Watchlist.changeProductStatus(product);
    if (toggle === 'added') {
      $scope.isWatched = true;
    } else if (toggle === 'removed') {
      $scope.isWatched = false;
    }
  };
  (function(){
    Actions.transparent(true);
    Actions.search(false);
    Actions.set({ menu: false, back: true });
    $scope.product = Products.selected();
    $scope.image = {
      'background-image': 'url(' + $scope.product.image_url + ')'
    };
    if (Watchlist.checkForProduct($scope.product)){
      $scope.isWatched = true;
    }
  })();
}]);
