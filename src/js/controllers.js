angular.module('elsie.controllers', [])
.controller('AppCtrl', function($scope, $state, $mdSidenav){
  function buildToggler(navID) {
    return function() {
      return $mdSidenav(navID).toggle();
    }
  }
  $scope.toggleMenu = buildToggler('menu'); 
  $scope.go = function(destination){
    $state.go(destination);
  }
})
.controller('HomeCtrl', function($scope, $state) {
  //
})
.controller('WatchlistCtrl', function($scope, Watchlist) {
  Watchlist.load().then(function(result){
    console.log(result);
  })
})
.controller('SearchCtrl', function($scope, $state, Products) {
  $scope.selectedProduct = {};
  $scope.change = function(change) {
    console.log(change);
  };
  $scope.search = function(query) {
    return Products.search(query).then(function(result){
      $scope.products = result;
      return $scope.products;
    });
  }
  $scope.selectProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      $state.go('product');
    }
  };
})
.controller('MenuCtrl', function ($scope, $state, $mdSidenav) {
  $scope.go = function(destination){
    $mdSidenav('menu').close();
    $state.go(destination);
  }
  $scope.close = function () {
    $mdSidenav('menu').close();
  };
})
.controller('ProductCtrl', function ($scope, $state, Products) {
  (function(){
    $scope.product = Products.selected();
  })();
});
