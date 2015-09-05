angular.module('elsie.splash')
.controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'elsie.auth', function($scope, $rootScope, $state, Auth){
  $scope.signIn = function(){
    if ($scope.shown){
      Auth.login($scope.user).then(function(res) {
        $rootScope.$broadcast('session.init', res);
      }, function(error){
        $scope.error.visible = true;
        $scope.error.message = "Login failed. Reason: " + error.message;
      });
    } else {
      $scope.shown = true;
    }
  };
  (function(){
    //init
  })();
}]);