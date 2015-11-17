angular.module('elsie.product')
.controller('ProductCtrl', ['$scope', '$state', 'Products', 'Watchlist', 'Actions', 'Picks', '$timeout', function ($scope, $state, Products, Watchlist, Actions, Picks, $timeout) {
  $scope.toggleWatch = function(product){
    var toggle = Watchlist.changeProductStatus(product);
    if (toggle === 'added') {
      $scope.isWatched = true;
    } else if (toggle === 'removed') {
      $scope.isWatched = false;
    }
  };
  $scope.isPick = function(product) {
    if (Object.keys(product.pick).length > 0) {
      return true;
    } else {
      return false;
    }
  };
  $scope.getRating = function(num) {
    return new Array(num);   
  };
  (function(){
    Actions.show();
    Actions.transparent(true);
    Actions.search(false);
    Actions.set({ menu: false, back: true });
    Actions.backGoesHome(false);
    $scope.product = Products.selected();
    $scope.product.pick = Picks.check($scope.product);
    $scope.image = {
      'background-position-y': '120%',
      'background-image': 'url(' + $scope.product.image_url + ')'
    };
    if (Watchlist.checkForProduct($scope.product)){
      $scope.isWatched = true;
    }
    $scope.tags = (function(){
      return $scope.product.tags.split(" ");
    })();
    $timeout(function(){
      $scope.image['background-position-y'] = '-10%';
    }, 500);
  })();
}]);
