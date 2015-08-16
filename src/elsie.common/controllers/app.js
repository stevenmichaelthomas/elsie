angular.module('elsie.common', [])
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
});