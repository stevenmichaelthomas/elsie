angular.module('elsie.splash')
.controller('SignupCtrl', ['$scope', '$rootScope', '$state', 'elsie.auth', 'Actions', 'Navigator', function($scope, $rootScope, $state, Auth, Actions, Navigator){
  $scope.login = function(){
    Auth.signup($scope.user).then(function(res) {
      if (res.token) {
        $rootScope.$broadcast('session.init', res);
      }
    });
  };
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  (function(){
    Actions.show();
    Actions.theme('transparent');
    Actions.search(false);
    Actions.set({ menu: false, back: true, logo: false });
    Actions.backGoesHome(false);
  })();
}]);