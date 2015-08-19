angular.module('elsie.common')
.controller('AppCtrl', function($scope, $state, $history, $mdSidenav){
  
  function buildToggler(navID) {
    return function() {
      return $mdSidenav(navID).toggle();
    };
  }

  $scope.toggleMenu = buildToggler('menu'); 
  $scope.go = function(destination){
    $state.go(destination);
  };
  $scope.back = function(){
    $history.back();
  };
  $scope.followLink = function(url){
    //navigator.app.loadUrl(url, {openExternal : true});
    window.open(url, '_system');
  };

  (function(){
    //init routine
  })();
  
});