angular.module('elsie.home')
.controller('HomeCtrl', function($scope, $timeout, Navigator, Products, Stores, Cache, Actions) {
  $scope.query = {
    product: null,
    store: null
  };
  $scope.clear = function(){
    if ($scope.results.mode === 'store'){
      $scope.query.store = null;
    }
    if ($scope.results.mode === 'product'){
      $scope.query.product = null;
    }
  };
  $scope.searchProducts = function(query) {
    return Products.search(query).then(function(result){
      $scope.results.products = result;
      Cache.update($scope.results);
      return $scope.results.products;
    });
  };
  $scope.selectProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product');
    }
  };
  $scope.searchStores = function(query) {
    return Stores.search(query).then(function(result){
      $scope.results.stores = result;
      Cache.update($scope.results);
      return $scope.results.stores;
    });
  };
  $scope.selectStore = function(store){
    if (store && store.name){
      Stores.select(store);
      Navigator.go('store');
    }
  };
  $scope.getTab = function(){
    if ($scope.results.mode === 'product'){
      return 0;
    } else if ($scope.results.mode === 'store'){
      return 1;
    }
  };
  $scope.$watch('results.mode', function(){
    Cache.update($scope.results);
  });
  (function(){
    Actions.transparent(false);
    Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $scope.results = Cache.get();
    $scope.selectedTab = $scope.getTab();
    $scope.showSearch = true;
  })();
});