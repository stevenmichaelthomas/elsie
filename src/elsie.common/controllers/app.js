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
  $scope.followLink = function(url){
    //navigator.app.loadUrl(url, {openExternal : true});
    window.open(url, '_system');
  };

  (function(){
    //init routine
    if (typeof Windows !== 'undefined') {
      // WinRT is available
      var statusBar = Windows.UI.ViewManagement.StatusBar.getForCurrentView();
      statusBar.backgroundColor = {a: 255, r: 103, g: 65, b: 114};
      statusBar.backgroundOpacity = 1;
      statusBar.showAsync();
    }
  }()
  
});