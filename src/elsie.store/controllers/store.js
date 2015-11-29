angular.module('elsie.store')
.controller('StoreCtrl', function ($scope, $state, Stores, Map, Actions) {
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
  })();
});
