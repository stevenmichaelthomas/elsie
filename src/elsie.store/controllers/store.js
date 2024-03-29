/* global Velocity */
/* global launchnavigator */
angular.module('elsie.store')
.controller('StoreCtrl', ['$scope', '$state', '$timeout', 'Stores', 'Map', 'Actions', 'elsie.session', 'Settings', 'Dialog', function ($scope, $state, $timeout, Stores, Map, Actions, Session, Settings, Dialog) {
  $scope.call = function(number){
    number = number.replace(/\D/g,'');
    console.log(number);
    window.open('tel:' + number, '_system');
  };
  $scope.navigate = function(lat, lon){
    launchnavigator.navigate(
      [lat, lon],
      null,
      function(){
        //success
      },
      function(error){
        //error
      },
      {
        preferGoogleMaps: true,
        transportMode: 'driving',
        enableDebug: false,
        disableAutoGeolocation: false
    });
  };
  $scope.isHome = function(store) {
    return Settings.isHome(store);
  };
  $scope.setHomeStore = function(store) {
    if (!Session.active()){
      var message = 'With an account, you can set this store as your home store to quickly check product availability.';
      var actions = [
        { label: 'OK' }
      ];
      var title = 'Can\'t do that yet';
      Dialog.show(message, actions, title);
      return;
    }
    if (!$scope.isHome(store)) {
      Settings.setHomeStore(store).then(function(data){
        var message = $scope.store.name + ' has been set as your home store.';
        var actions = [
          { label: 'OK' }
        ];
        var title = 'Home store set';
        Dialog.show(message, actions, title);
        $scope.settings = data;
      });
    } else {
      Settings.unsetHomeStore().then(function(data){
        var message = 'Your home store has been unset.';
        var actions = [
          { label: 'OK' }
        ];
        var title = 'Home store unset';
        Dialog.show(message, actions, title);
        $scope.settings = data;
      });
    }
    
  };
  $scope.$watch('position', function(val){
    // deviceHeight from bottom
    if (val > 180) {
      Actions.theme('purple');
      Actions.set({ title: $scope.store.name, menu: false, back: true, search: false, watchlist: false, locating: false, logo: false });
    } else {
      Actions.theme('transparent');
      Actions.set({ menu: false, back: true, logo: false });
    }
  });
  (function(){
    $scope.position = 0;
    $scope.deviceHeight = window.innerHeight;
    
    Actions.show();
    Actions.theme('transparent');
    Actions.search(false);
    Actions.set({ menu: false, back: true, logo: false });
    Actions.backGoesHome(false);
    
    $scope.store = Stores.selected();
    $scope.status = Stores.status;
    $scope.today = Stores.today;
    $scope.image = {
      'background-image': 'url(' + Map.large($scope.store.latitude, $scope.store.longitude) + ')'
    };

    $timeout(function(){
      Velocity(document.getElementById('md-fab'), 
        'transition.expandIn', 500);
    }, 1250);

  })();
}]);
