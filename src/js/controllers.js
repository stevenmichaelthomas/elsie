angular.module('elsie.controllers', [])
.controller('AppCtrl', function($scope, $state, $mdSidenav){
  function buildToggler(navID) {
    return function() {
      return $mdSidenav(navID).toggle();
    }
  }
  $scope.toggleMenu = buildToggler('menu'); 
  $scope.go = function(destination){
    $state.go(destination);
  }
})
.controller('HomeCtrl', function($scope, $state) {
  $scope.gridView = false;
  $scope.toggleGrid = function(value){
    $scope.gridView = value;
  };
})
.controller('WatchlistCtrl', function($scope, $state, Watchlist, Products) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      $state.go('product');
    }
  };
  $scope.watchlist = Watchlist.load();
  $scope.productStyle = function(product){
    var style = {
      "background-image": "url('" + product.image_url + "')"
    }
    return style;
  };
})
.controller('SearchCtrl', function($scope, $state, Products) {
  $scope.selectedProduct = {};
  $scope.change = function(change) {
    console.log(change);
  };
  $scope.search = function(query) {
    return Products.search(query).then(function(result){
      $scope.products = result;
      return $scope.products;
    });
  }
  $scope.selectProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      $state.go('product');
    }
  };
})
.controller('MenuCtrl', function ($scope, $state, $mdSidenav) {
  $scope.go = function(destination){
    $mdSidenav('menu').close();
    $state.go(destination);
  }
  $scope.close = function () {
    $mdSidenav('menu').close();
  };
})
.controller('ProductCtrl', function ($scope, $state, Products, Watchlist) {
  $scope.toggleWatch = function(product){
    var toggle = Watchlist.changeProductStatus(product);
    if (toggle === 'added') {
      $scope.isWatched = true;
    } else if (toggle === 'removed') {
      $scope.isWatched = false;
    }
  };
  (function(){
    $scope.product = Products.selected();
    $scope.image = {
      'background-image': 'url(' + $scope.product.image_url + ')'
    };
    if (Watchlist.checkForProduct($scope.product))
      $scope.isWatched = true;
  })();
});
