/* global $ */
angular.module('elsie.home')
.controller('HomeCtrl', ['$scope', '$timeout', 'Navigator', 'Products', 'Stores', 'Cache', 'Actions', 'Picks', 'Watchlist', 'Locator', 'Bump', 'Greetings', 'elsie.session', '$window',
  function($scope, $timeout, Navigator, Products, Stores, Cache, Actions, Picks, Watchlist, Locator, Bump, Greetings, Session, $window) {
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
    $scope.searching = true;
    return Products.search(query).then(function(result){
      angular.forEach(result, function(res, i){
        res.pick = Picks.check(res);
      });
      $scope.results.products = result;
      Cache.update($scope.results);
      $scope.searching = false;
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
      $window.scrollTo(0,0);
      Actions.hide();
      $scope.locked = true;
    } else {
      Actions.show();
      $scope.locked = false;
    }
  });
  (function(){
    Actions.show();
    Actions.theme('purple');
    Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, locating: true, logo: true });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $scope.welcome = Greetings.english();
    $scope.results = Cache.get();
    $timeout(function(){
      if (Session.active()){
        Watchlist.load();
      }
    }, 1000);
    $timeout(function(){
      Picks.all().then(function(){
        angular.forEach(Picks.latest(), function(p, i){
          Products.one(p.productNumber).then(function(one){
            one.pick = p;
            $scope.picks.push(one);
          });
        });
      }); // Picks.latest
    }, 750);
    $timeout(function(){
      Locator.initialize();
      Locator.refresh().then(function(){
        Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, locating: false, logo: true });
      });
    }, 500);
  })();
}]);