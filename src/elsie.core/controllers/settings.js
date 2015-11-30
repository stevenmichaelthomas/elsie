/* global facebookConnectPlugin */
angular.module('elsie.core')
.controller('SettingsCtrl', ['$scope', 'Settings', 'Actions', 'elsie.auth', 'elsie.session', 'Dialog', 'Stores', 'Navigator', function($scope, Settings, Actions, Auth, Session, Dialog, Stores, Navigator) {
  var fbLoginSuccess = function(data) {
    var account = Session.get('id');
    facebookConnectPlugin.getAccessToken(function(token) {
      Auth.facebookLink(token, account).then(function(res) {
        Settings.get().then(function(data){
          $scope.facebook = data.facebookId;
        });
      }, function(error){
        var message = error.data.message;
        var actions = [
          { label: 'OK' }
        ];
        var title = 'Facebook Auth Error';
        Dialog.show(message, actions, title);
      });
    }, function(error) {
      var message = error;
      var actions = [
        { label: 'OK' }
      ];
      var title = 'Facebook Auth Error';
      Dialog.show(message, actions, title);
    });
  };
  $scope.link = function() {
    if ($scope.facebook) {
      return;
    }
    facebookConnectPlugin.login(['email','public_profile','user_friends'],
      fbLoginSuccess,
      function (error) { 
        console.log(error);
      }
    );
  };
  $scope.loadHomeStore = function() {
    var store = Settings.home();
    Stores.one(store.id).then(function(data){
      console.log('data', data);
      console.log('store fed', store);
      Stores.select(data.result);
      Navigator.go('store');
    });
  };
  (function init(){
    Actions.theme('purple');
    Actions.set({ title: 'Settings', menu: false, back: true, search: false, watchlist: false, logo: false });
    Settings.get().then(function(data){
      $scope.profile = {
        firstName: data.firstName,
        lastName: data.lastName
      };
      $scope.facebook = data.facebookId;
      $scope.settings = data.settings;
      $scope.loaded = true;
    });
  })();
}]);