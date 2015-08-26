angular.module('elsie.common')
.controller('AppCtrl', function($scope, $state, $history, $timeout, Actions, Navigator){

  var transitionEnd = function(){
    var el = document.querySelector('#main');
    var classes = el.classList;
    for (var c = classes.length; c > 0; c--){
      if (classes[c]){
        var arr = classes[c].split('-');
        var index = -1;
        if (arr.length > 0){
          index = arr.indexOf('direction');
          if (index !== -1){
            angular.element(el).removeClass(classes[c]);
          }
        }
      }
    }
  };

  var transitionStart = function(event, toState, toParams, fromState, fromParams){
    var el = document.querySelector('#main');
    if (toState.priority > fromState.priority){
      angular.element(el).addClass('direction-forward');
    } 
    if (toState.priority < fromState.priority) {
      angular.element(el).addClass('direction-back');
    }
    $timeout(function(){
      transitionEnd();
    }, 750);
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