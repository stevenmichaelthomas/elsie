angular.module('elsie.common')
.controller('AppCtrl', function($scope, $state, $history, Actions, Navigator){
  
  $scope.followLink = function(url){
    //navigator.app.loadUrl(url, {openExternal : true});
    window.open(url, '_system');
  };
  $scope.barTransparency = Actions.transparent;
  $scope.barItems = Actions.get;
  $scope.barSearch = Actions.search;
  (function(){
    //init routine
  })();
  
});