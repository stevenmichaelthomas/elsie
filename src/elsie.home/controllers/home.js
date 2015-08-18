angular.module('elsie.home')
.controller('HomeCtrl', function($scope) {
  $scope.gridView = true;
  $scope.toggleGrid = function(value){
    $scope.gridView = value;
  };
});