/* global $ */
angular.module('elsie.product')
.controller('ProductCtrl', ['$scope', 'Navigator', 'Products', 'Stores', 'Watchlist', 'Actions', 'Picks', 'Bump', 'elsie.session', '$timeout', function ($scope, Navigator, Products, Stores, Watchlist, Actions, Picks, Bump, Session, $timeout) {
  $scope.toggleWatch = function(product){
    var toggle = Watchlist.changeProductStatus(product);
    if (toggle === 'added') {
      $scope.isWatched = true;
    } else if (toggle === 'removed') {
      $scope.isWatched = false;
    }
  };
  $scope.loadStore = function(store) {
    Stores.select(store);
    Navigator.go('store');
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
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  $scope.content = {
    'height' : $(window).innerHeight() - 56 - Bump + 'px'
  };
  (function(){
    Actions.show();
    Actions.theme('transparent');
    Actions.search(false);
    Actions.set({ menu: false, back: true, logo: false });
    Actions.backGoesHome(false);

    $scope.product = Products.selected();
    $scope.product.pick = Picks.check($scope.product);

    $scope.image = {
      'background-position-y': '-220%',
      'background-image': 'url(' + $scope.product.image_url + ')'
    };

    if (Session.active()) {
      $scope.session = true;
      if (Watchlist.checkForProduct($scope.product)){
        $scope.isWatched = true;
      }
    }

    $scope.storesLoading = true;

    $timeout(function(){
      $scope.image['background-position-y'] = '-88%';
      Products.atNearbyStores($scope.product).then(function(data){
        $scope.product.stores = data.stores;
        $scope.storesLoading = false;
      });
    }, 750);
  })();
}]);
