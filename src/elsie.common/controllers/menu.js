angular.module('elsie.common')
.controller('MenuCtrl', function ($scope, $state, $mdSidenav) {
  $scope.go = function(destination){
    $mdSidenav('menu').close();
    $state.go(destination);
  };
  $scope.close = function () {
    $mdSidenav('menu').close();
  };
});