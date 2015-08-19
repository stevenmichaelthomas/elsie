angular.module('elsie.store')
.controller('StoreCtrl', function ($scope, $state, Stores, Map) {
  (function(){
    $scope.store = Stores.selected();
    $scope.image = {
      'background-image': 'url(' + Map.get($scope.store.latitude, $scope.store.longitude) + ')'
    };
  })();
});
