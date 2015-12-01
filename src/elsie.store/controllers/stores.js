angular.module('elsie.core')
.controller('StoresWithProductCtrl', ['$scope', '$timeout', 'Navigator', 'Picks', 'Products', 'Stores', 'Actions', 'elsie.session',
  function($scope, $timeout, Navigator, Picks, Products, Stores, Actions, Session) {
  $scope.loadStore = function(store) {
    Stores.select(store);
    Navigator.go('store');
  };
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  (function(){
    Actions.theme('purple');
    Actions.set({ title: 'Inventory', menu: false, back: true, search: false, watchlist: false });
    $scope.product = Products.selected();
    $scope.loaded = true;
  })();
}]);