angular.module('elsie.core')
.controller('SettingsCtrl', ['$scope', 'Settings', 'Actions', function($scope, Settings, Actions) {
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
    });
  })();
}]);