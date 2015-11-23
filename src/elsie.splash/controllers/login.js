angular.module('elsie.splash')
.controller('LoginCtrl', ['$scope', '$rootScope', '$state', 'elsie.auth', 'Actions', function($scope, $rootScope, $state, Auth, Actions){
  $scope.login = function(){
    Auth.login($scope.user).then(function(res) {
      $rootScope.$broadcast('session.init', res);
    }, function(error){
      $scope.error.visible = true;
      $scope.error.message = "Login failed. Reason: " + error.message;
    });
  };
  (function(){
    Actions.theme('transparent');
    Actions.search(false);
    Actions.set({ menu: false, back: true, logo: false });
    Actions.backGoesHome(false);
  })();
}]);