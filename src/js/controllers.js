angular.module('elsie.controllers', [])
.controller('AppCtrl', function($scope, $state, $mdSidenav){
  function buildToggler(navID) {
    return function() {
      return $mdSidenav(navID).toggle();
    }
  }
  $scope.toggleMenu = buildToggler('menu'); 
})
.controller('HomeCtrl', function($scope, $state) {
  $scope.go = function(destination){
    $state.go(destination);
  }
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
    $scope.product = product;
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
});
