angular.module('elsie.common')
.directive('actionBar', ['Navigator', 'Actions', '$mdSidenav', function(Navigator, Actions, $mdSidenav) {
  return {
    replace: true,
    scope: {
      transparent: '=',
      set: '=',
      search: '='
    },
    templateUrl: 'templates/action-bar.html',
    link: function($scope, $element, $attrs) {
      function buildToggler(navID) {
        return function() {
          return $mdSidenav(navID).toggle();
        };
      }
      $scope.toggleMenu = buildToggler('menu'); 
      $scope.back = function(){
        if (Actions.backGoesHome()){
          Navigator.go('home', 'back');
        } else {
          Navigator.back();
        }
      };
      $scope.go = function(destination, direction){
        Navigator.go(destination, direction);
      };
      (function init(){
        //
      })();
    }
  };
}]);