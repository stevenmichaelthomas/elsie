angular.module('elsie.common')
.controller('AppCtrl', function($scope, $state, $history, $timeout, Actions, Navigator){

  var transitionEnd = function(){
      $scope.waiting = true;
      $timeout(function(){
        document.querySelector('#main').classList.remove('direction-back');
        document.querySelector('#main').classList.remove('direction-forward');
        $scope.waiting = false;
      },1500);
  };

  var transitionStart = function(event, toState, toParams, fromState, fromParams){
    if ($scope.waiting){
      event.preventDefault();
      return;
    }
    if (toState.priority > fromState.priority){
      document.querySelector('#main').classList.add('direction-forward');
    } 
    if (toState.priority < fromState.priority) {
      document.querySelector('#main').classList.add('direction-back');
    }
    if (toState.priority === fromState.priority) {
      document.querySelector('#main').classList.add('direction-no-anim');
    }
    transitionEnd();
  };

  $scope.go = function(destination){
    Navigator.go(destination);
  };
  
  $scope.followLink = function(url){
    //navigator.app.loadUrl(url, {openExternal : true});
    window.open(url, '_system');
  };
  
  $scope.$on('$stateChangeStart', transitionStart);
  $scope.barTransparency = Actions.transparent;
  $scope.barItems = Actions.get;
  $scope.barSearch = Actions.search;
  
  (function(){
    //init routine
  })();
  
});