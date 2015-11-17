angular.module('elsie.home')
.controller('HomeCtrl', function($scope, $timeout, Navigator, Products, Stores, Cache, Actions, Picks, Watchlist) {
  $scope.welcome = 'Let\'s get started.';
  $scope.query = '';
  $scope.flex = {
    search: 95,
    explore: 5,
    results: 0
  };
  $scope.picks = [];
  $scope.clear = function(){
    $scope.query = '';
  };
  $scope.search = function(query) {
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
  $scope.$watch('results.mode', function(){
    Cache.update($scope.results);
  });
  $scope.$watch('query', function(val){
    if (val !== "") {
      $scope.flex.search = 15;
      $scope.flex.results = 85;
      Actions.hide();
    } else {
      $scope.flex.search = 95;
      $scope.flex.results = 0;
      Actions.show();
    }
  });
  (function(){
    Actions.show();
    Actions.transparent(false);
    Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $scope.results = Cache.get();
    Picks.latest().then(function(picks){
      angular.forEach(picks, function(p, i){
        Products.one(p.productNumber).then(function(one){
          if (i === 0){
            $scope.featured = one;
            $scope.featured.pick = p;
          }
          $scope.picks.push(one);
        });
      });
    }); // Picks.latest
    Watchlist.load();
  })();
});