/* global Velocity */
/* global Keyboard */
angular.module('elsie.core')
.controller('HomeCtrl', ['$scope', '$timeout', 'Navigator', 'Barcode', 'Products', 'Stores', 'Cache', 'Actions', 'Picks', 'Watchlist', 'Locator', 'Bump', 'Greetings', 'Hints', 'Dialog', 'elsie.session', 'Settings',
  function($scope, $timeout, Navigator, Barcode, Products, Stores, Cache, Actions, Picks, Watchlist, Locator, Bump, Greetings, Hints, Dialog, Session, Settings) {
  var keyboardEventBindings = function() {
    Keyboard.onshow = function () {
      window.scrollTo(0,0);
      $scope.setTabsHeight(true);
      $timeout(function(){
        window.scrollTo(0,0);
      },500);
    };
    Keyboard.onhide = function () {
      window.scrollTo(0,0);
      $scope.setTabsHeight(false);
    };
    Keyboard.onshowing = function () {
      window.scrollTo(0,0);
    };
  };
  $scope.setTabsHeight = function(keyboardUp){
    var viewport = window.innerHeight + 20;
    var tabsArea = viewport - 40;
    if (!keyboardUp) {
      tabsArea = tabsArea - 40;
    }
    tabsArea = tabsArea + 'px';
    Velocity(document.getElementById('tabs'), {
        height: tabsArea
    }, {
      duration: 350
    });
  };
  $scope.clear = function(){
    $scope.results.query = '';
    document.getElementById('search').blur();
  };
  $scope.scanBarcode = function(){
    Barcode.scan().then(function(data){
      $scope.selectProduct(data.text);
    });
  };
  $scope.search = function(query) {
    if (!query || query === ''){
      return;
    }
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
    } else if (product) {
      Products.one(product).then(function(data){
        if (!data) {
          var message = 'Elsie couldn\'t find that product at the LCBO. Try a text search!';
          var actions = [
            { label: 'OK' }
          ];
          var title = 'Hmm...';
          Dialog.show(message, actions, title);
          return;
        }
        Products.select(data);
        Navigator.go('product');
      });
    }
  };
  $scope.selectStore = function(store){
    Cache.update($scope.results);
    if (store && store.name){
      Stores.select(store);
      Navigator.go('store');
    }
  };
  $scope.isHome = function(store) {
    return Settings.isHome(store);
  };
  $scope.modeSelect = function(mode){
    $scope.results.mode = mode;
    $scope.search($scope.results.query);
    $scope.setTabsHeight();
  };
  $scope.focus = function() {
    Actions.theme('hidden');
    Actions.hide();

    var title = document.getElementById('search-title');
    var hint = document.getElementById('search-hint');
    var picks = document.getElementById('picks');
    title.style.display = 'none';
    hint.style.display = 'none';
    picks.style.display = 'none';
    
    $scope.locked = true;
    $scope.expanded = true;

    Velocity(document.getElementById('search'), {
      width: '100%',
      marginBottom: 0
    }, {
      duration: 200
    });

    Velocity(document.getElementById('search-container'), {
      height: '42px'
    }, {
      duration: 200
    });
    
    $scope.results.active = true;
  };
  $scope.unfocus = function() {
    if ($scope.searching) {
      return;
    }

    var title = document.getElementById('search-title');
    var hint = document.getElementById('search-hint');
    var picks = document.getElementById('picks');
    title.style.display = 'block';
    hint.style.display = 'block';
    
    $scope.clear();
    $scope.locked = false;
    $scope.expanded = false;

    Velocity(document.getElementById('search'), {
      width: '85%',
      marginBottom: '20px'
    }, {
      duration: 200
    });
    
    Velocity(document.getElementById('search-container'), {
      height: '100%'
    }, {
      duration: 200
    });
    
    $scope.results.active = false;
    
    $timeout(function(){
      Actions.show();
      Actions.theme('purple');
    }, 500);
    
    $timeout(function(){
      picks.style.display = 'block';
    }, 1000);
  };
  $scope.goExplore = function() {
    Velocity(document.getElementById('picks'), 
      'scroll', {
      duration: 350,
      offset: -56,
      container: document.getElementById('md-content')
    });
  };
  $scope.$watch('position', function(val){
    // deviceHeight from bottom
    if (val > $scope.deviceHeight) {
      Actions.set({ title: 'kwäf Picks', menu: true, back: false, search: false, suggestions: true, watchlist: true, locating: false, logo: false });
    } else {
      Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, suggestions: true, locating: false, logo: true });
    }

    // 200 from bottom
    if (val > $scope.deviceHeight - 100) {
      $scope.fadeTrigger = true;
    } else {
      $scope.fadeTrigger = false;
    }
  });
  $scope.$watch('results.query', function (val) {
    if (val !== ''){
      $scope.search(val);
    }
  });
  (function(){
    $scope.deviceHeight = window.innerHeight;
    $scope.position = 0;

    // Greeting
    $scope.welcome = Greetings.english();
    $scope.hint = Hints.english();

    // Action bar
    Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, suggestions: false, locating: true, logo: true });
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
    } else {
      Actions.theme('purple');
      Actions.show();
    }
    
    // Watchlist
    $timeout(function(){
      if (Session.active()){
        Watchlist.load();
      }
    }, 2000);

    // Settings
    $timeout(function(){
      if (Session.active()){
        Settings.get();
      }
    }, 3000);

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
        Actions.set({ title: '', menu: true, back: false, search: false, watchlist: true, suggestions: true, locating: false, logo: true });
      });
    }, 750);

  })();
}]);