angular.module('elsie.store')
.controller('StoreCtrl', function ($scope, $state, Stores, Map, Actions) {
  (function(){
    Actions.show();
    Actions.theme('transparent');
    Actions.search(false);
    Actions.set({ menu: false, back: true, logo: false });
    Actions.backGoesHome(false);
    $scope.store = Stores.selected();
    $scope.image = {
      'background-image': 'url(' + Map.large($scope.store.latitude, $scope.store.longitude) + ')'
    };
  })();
});
