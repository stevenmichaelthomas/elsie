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
.controller('MenuCtrl', function ($scope, $state, $mdSidenav) {
  $scope.go = function(destination){
    $mdSidenav('menu').close();
    $state.go(destination);
  }
  $scope.close = function () {
    $mdSidenav('menu').close();
  };
});
