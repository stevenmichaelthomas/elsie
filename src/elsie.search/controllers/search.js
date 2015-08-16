angular.module('elsie.search')
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
});