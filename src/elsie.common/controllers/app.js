angular.module('elsie.common')
.controller('AppCtrl', ['$scope', '$state', '$history', '$timeout', 'Actions', 'Navigator', function($scope, $state, $history, $timeout, Actions, Navigator){

  var transitionStart = function(event, toState, toParams, fromState, fromParams){
    
    document.getElementById('main').classList.remove('direction-back');
    document.getElementById('main').classList.remove('direction-forward');

    if (toState.priority > fromState.priority){
      document.getElementById('main').classList.add('direction-forward');
    } 
    if (toState.priority < fromState.priority) {
      document.getElementById('main').classList.add('direction-back');
    }
    if (toState.priority === fromState.priority) {
      document.getElementById('main').classList.add('direction-no-anim');
    }
    $scope.priority = toState.priority;
  };

  $scope.go = function(destination){
    Navigator.go(destination);
  };
  
  $scope.followLink = function(url){
    //navigator.app.loadUrl(url, {openExternal : true});
    window.open(url, '_system');
  };
  
  $scope.$on('$stateChangeStart', transitionStart);
  $scope.barLight = Actions.light;
  $scope.barItems = Actions.get;
  $scope.barSearch = Actions.search;
  $scope.barVisible = Actions.visible;
  
  (function(){
    //init routine
  })();
  
}]);