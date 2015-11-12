angular.module('elsie.store')
.controller('StoreCtrl', function ($scope, $state, Stores, Map, Actions) {
  (function(){
    Actions.show();
    Actions.transparent(true);
    Actions.search(false);
    Actions.set({ menu: false, back: true });
    Actions.backGoesHome(false);
    $scope.store = Stores.selected();
    $scope.image = {
      'background-image': 'url(' + Map.get($scope.store.latitude, $scope.store.longitude) + ')'
    };
  })();
});
