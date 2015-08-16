angular.module('elsie.home', [])
.controller('HomeCtrl', function($scope, $state) {
  $scope.gridView = false;
  $scope.toggleGrid = function(value){
    $scope.gridView = value;
  };
});