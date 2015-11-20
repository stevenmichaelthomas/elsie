angular.module('elsie.splash')
.controller('SignupCtrl', ['$scope', '$rootScope', '$state', 'elsie.auth', 'Actions', function($scope, $rootScope, $state, Auth, Actions){
  $scope.login = function(){
    Auth.signup($scope.user).then(function(res) {
      $rootScope.$broadcast('session.init', res);
    }, function(error){
      $scope.error.visible = true;
      $scope.error.message = "Signup failed. Reason: " + error.message;
    });
  };
  (function(){
    Actions.theme('transparent');
    Actions.search(false);
    Actions.set({ menu: false, back: true });
    Actions.backGoesHome(false);
  })();
}]);