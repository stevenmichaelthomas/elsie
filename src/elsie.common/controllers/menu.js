angular.module('elsie.common')
.controller('MenuCtrl', function ($scope, Navigator, $mdSidenav) {
  $scope.go = function(destination){
    $mdSidenav('menu').close();
    Navigator.go(destination);
  };
  $scope.close = function () {
    $mdSidenav('menu').close();
  };
});