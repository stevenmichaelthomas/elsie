/* global Velocity */
angular.module('elsie.product')
.controller('ProductCtrl', ['$scope', 'Navigator', 'Products', 'Stores', 'Watchlist', 'Actions', 'Picks', 'Bump', 'Map', 'elsie.session', 'Settings', '$timeout', function ($scope, Navigator, Products, Stores, Watchlist, Actions, Picks, Bump, Map, Session, Settings, $timeout) {
  $scope.toggleWatch = function(product){
    if (!$scope.session) {
      Navigator.go('watchlist');
    }
    var toggle = Watchlist.changeProductStatus(product);
    if (toggle === 'added') {
      $scope.isWatched = true;
    } else if (toggle === 'removed') {
      $scope.isWatched = false;
    }
  };
  $scope.loadStore = function(store) {
    if (store.id) {
      Stores.select(store);
      Navigator.go('store');
    } else if (store.store_id) {
      Stores.one(store.store_id).then(function(data){
        Stores.select(data);
        Navigator.go('store');
      });
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
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  $scope.$watch('position', function(val){
    // deviceHeight from bottom
    if (val > 180) {
      Actions.theme('purple');
      Actions.set({ title: $scope.product.name, menu: false, back: true, search: false, watchlist: false, locating: false, logo: false });
    } else {
      Actions.theme('transparent');
      Actions.set({ menu: false, back: true, logo: false });
    }
  });
  $scope.content = {
    'height' : window.innerHeight - 56 - Bump + 'px'
  };
  (function(){
    $scope.position = 0;
    $scope.deviceHeight = window.innerHeight;

    Actions.show();
    Actions.theme('transparent');
    Actions.set({ menu: false, back: true, logo: false });
    Actions.backGoesHome(false);

    $scope.home = Settings.home();

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
    $scope.homeLoading = true;

    $timeout(function(){
      $scope.image['background-position-y'] = '-88%';
      Products.atNearbyStores($scope.product).then(function(data){
        $scope.product.stores = data.stores;
        $scope.storesLoading = false;
        $scope.map = {
          'background-image': 'url(' + Map.small($scope.product.stores[0].latitude, $scope.product.stores[0].longitude) + ')'
        };
      });
      Products.atHomeStore($scope.product).then(function(data){
        console.log('data', data);
        if (data) {
          $scope.product.home = data;
        }
        $scope.homeLoading = false;
      });
    }, 750);

    $timeout(function(){
      Velocity(document.getElementById('md-fab'), 
        'transition.expandIn', 500);
      Velocity(document.getElementById('md-fab'), 
        'callout.pulse', 500);
    }, 1250);

  })();
}]);
