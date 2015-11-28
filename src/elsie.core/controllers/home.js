/* global $ */
/* global Keyboard */
angular.module('elsie.core')
.controller('HomeCtrl', ['$scope', '$timeout', 'Navigator', 'Products', 'Stores', 'Cache', 'Actions', 'Picks', 'Watchlist', 'Locator', 'Bump', 'Greetings', 'elsie.session',
  function($scope, $timeout, Navigator, Products, Stores, Cache, Actions, Picks, Watchlist, Locator, Bump, Greetings, Session) {
  var keyboardEventBindings = function() {
    Keyboard.onshow = function () {
      window.scrollTo(0,0);
      $scope.setTabsHeight();
    };
    Keyboard.onhide = function () {
      window.scrollTo(0,0);
      $scope.setTabsHeight();
    };
    Keyboard.onshowing = function () {
      window.scrollTo(0,0);
    };
  };
  $scope.setTabsHeight = function(){
    var viewport = window.innerHeight + 20;
    var tabsArea = viewport - 40;
    tabsArea = tabsArea + 'px';
    console.log('setting to ', tabsArea);
    $('md-tabs').height(tabsArea);
  };
  $scope.clear = function(){
    $scope.results.query = '';
    $('#search').blur();
  };
  $scope.search = function(query) {
    if ($scope.results.mode === 0) {
      $scope.searchProducts(query);
    } else if ($scope.results.mode === 1) {
      $scope.searchStores(query);
    }
  };
  $scope.searchProducts = function(query) {
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
  $scope.searchStores = function(query) {
    $scope.searching = true;
    return Stores.search(query).then(function(result){
      $scope.results.stores = result;
      $scope.searching = false;
      Cache.update($scope.results);
      return $scope.results.stores;
    });
  };
  $scope.selectProduct = function(product){
    Cache.update($scope.results);
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product');
    }
  };
  $scope.selectStore = function(store){
    Cache.update($scope.results);
    if (store && store.name){
      Stores.select(store);
      Navigator.go('store');
    }
  };
  $scope.modeSelect = function(mode){
    if (mode === 0) {
      $scope.searchProducts($scope.results.query);
    } else if (mode === 1) {
      $scope.searchStores($scope.results.query);
    }
    $scope.results.mode = mode;
    $scope.setTabsHeight();
  };
  $scope.focus = function() {
    Actions.hide();
    $scope.locked = true;
    $scope.expanded = true;
    $scope.results.active = true;
  };
  $scope.unfocus = function() {
    if ($scope.searching) {
      return;
    }
    $scope.clear();
    $scope.locked = false;
    $scope.expanded = false;
    $scope.results.active = false;
    $timeout(function(){
      Actions.show();
    }, 300);
  };
  $scope.goExplore = function() {
    $('.home > md-content').animate({ scrollTop: $scope.deviceHeight - 40 }, 'fast');
  };
  $scope.$watch('position', function(val){
    // deviceHeight from bottom
    if (val > $scope.deviceHeight) {
      Actions.set({ title: 'kwäf picks', menu: true, back: false, search: false, watchlist: true, locating: false, logo: false });
    } else {
      Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, locating: false, logo: true });
    }

    // 200 from bottom
    if (val > $scope.deviceHeight - 100) {
      $scope.fadeTrigger = true;
    } else {
      $scope.fadeTrigger = false;
    }
  });
  (function(){
    $scope.deviceHeight = window.innerHeight;
    $scope.position = 0;

    // Greeting
    $scope.welcome = Greetings.english();

    // Action bar
    Actions.show();
    Actions.theme('purple');
    Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, locating: true, logo: true });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }

    // Load cache
    $scope.results = {};
    angular.copy(Cache.get(), $scope.results);
    if ($scope.results.active) {
      $scope.focus();
    }

    // $timeout(function(){
    //   $scope.setTabsHeight();
    // }, 500);
    
    // Watchlist
    // $timeout(function(){
    //   if (Session.active()){
    //     Watchlist.load();
    //   }
    // }, 1000);

    // Keyboard
    $timeout(function(){
      if (typeof Keyboard !== 'undefined') {
        keyboardEventBindings();
      } else {
        $timeout(function(){
          if (typeof Keyboard !== 'undefined') {
            keyboardEventBindings();
          }
        }, 500);
      }
    }, 500);

    // Picks
    $timeout(function(){
      Picks.all().then(function(){
        $scope.picks = [];
        angular.forEach(Picks.latest(), function(p, i){
          Products.one(p.productNumber).then(function(one){
            one.pick = p;
            $scope.picks.push(one);
          });
        });
      }); // Picks.all
    }, 750);

    // Location
    $timeout(function(){
      Locator.initialize();
      Locator.refresh().then(function(){
        Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, locating: false, logo: true });
      });
    }, 750);

  })();
}]);