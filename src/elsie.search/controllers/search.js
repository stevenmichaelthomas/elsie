angular.module('elsie.search')
.controller('SearchCtrl', function($scope, $state, Products, Stores) {
  $scope.query = {
    product: null,
    store: null
  };
  $scope.clear = function(){
    if ($scope.storeMode){
      $scope.query.store = null;
    }
    if (!$scope.storeMode){
      $scope.query.product = null;
    }
  };
  $scope.searchProducts = function(query) {
    return Products.search(query).then(function(result){
      $scope.products = result;
      return $scope.products;
    });
  };
  $scope.selectProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      $state.go('product');
    }
  };
  $scope.searchStores = function(query) {
    return Stores.search(query).then(function(result){
      $scope.stores = result;
      return $scope.stores;
    });
  };
  $scope.selectStore = function(store){
    if (store && store.name){
      Stores.select(store);
      $state.go('store');
    }
  };
  $scope.logScope = function(){
    console.log($scope);
  };
  $scope.$watch('storeMode', function(){
    console.log('change');
    setTimeout(function(){
      document.querySelector('.md-toolbar-tools input').focus();
    },100);
  });
  (function(){
    setTimeout(function(){
      document.querySelector('.md-toolbar-tools input').focus();
    },100);
  })();
});