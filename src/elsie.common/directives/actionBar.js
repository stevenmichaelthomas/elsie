angular.module('elsie.common')
.directive('actionBar', ['Navigator', 'Actions', 'Watchlist', '$mdSidenav', '$rootScope', function(Navigator, Actions, Watchlist, $mdSidenav, $rootScope) {
  return {
    replace: true,
    scope: {
      show: '=',
      theme: '=',
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
      $scope.refreshWatchlist = function(){
        $rootScope.$broadcast('WATCHLIST_REFRESH_START');
        Watchlist.refreshWatchlistData().then(function(){
          $rootScope.$broadcast('WATCHLIST_REFRESH_COMPLETE');
        });
      };
      (function init(){
        //
      })();
    }
  };
}]);