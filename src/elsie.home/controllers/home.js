angular.module('elsie.home')
.controller('HomeCtrl', ['$scope', 'Actions', function($scope, Actions) {
  $scope.currentTab = 'explore';
  $scope.changeTab = function(tab){
    $scope.currentTab = tab;
  };
  (function(){
    Actions.transparent(false);
    Actions.search(false);
    Actions.set({ title: 'Elsie', menu: true, back: false, search: true });
  })();
}]);