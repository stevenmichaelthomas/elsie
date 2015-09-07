angular.module('elsie.product')
.controller('ProductCtrl', ['$scope', '$state', 'Products', 'Watchlist', 'Actions', 'Picks', function ($scope, $state, Products, Watchlist, Actions, Picks) {
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
    Actions.backGoesHome(false);
    $scope.product = Products.selected();
    $scope.product.pick = Picks.check($scope.product);
    $scope.image = {
      'background-image': 'url(' + $scope.product.image_url + ')'
    };
    if (Watchlist.checkForProduct($scope.product)){
      $scope.isWatched = true;
    }
    $scope.tags = (function(){
      return $scope.product.tags.split(" ");
    })();
  })();
}]);
