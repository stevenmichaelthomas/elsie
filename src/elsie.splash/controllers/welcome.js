/* global facebookConnectPlugin */
angular.module('elsie.splash')
.controller('WelcomeCtrl', ['$scope', '$rootScope', 'Actions', 'elsie.session', 'elsie.auth', '$state', '$mdToast', function($scope, $rootScope, Actions, Session, Auth, $state, $mdToast){
  (function(){
    if (Session.active()){
      console.log('session is active, going home');
      //$state.go('home');
      return;
    }
    var fbLoginSuccess = function(data) {
      facebookConnectPlugin.getAccessToken(function(token) {
        Auth.facebook(token).then(function(res) {
          $rootScope.$broadcast('session.init', res);
        }, function(error){
          $scope.error.visible = true;
          $scope.error.message = 'Facebook Auth failed. Reason: ' + error.message;
        });
      }, function(err) {
        $mdToast.showSimple('There was a problem authenticating with Facebook.');
      });
    };
    $scope.facebook = function(){
      facebookConnectPlugin.login(['email','public_profile','user_friends'],
        fbLoginSuccess,
        function (error) { 
          console.log(error);
        }
      );
    };
    Actions.hide();
    Actions.search(false);
    Actions.set({ menu: false, back: false, logo: false });
    Actions.backGoesHome(false);
  })();
}]);