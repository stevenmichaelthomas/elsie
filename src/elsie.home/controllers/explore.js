angular.module('elsie.home')
.controller('ExploreCtrl', function($scope, Navigator, Watchlist, Products, Picks) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product');
    }
  };
  $scope.loadPick = function(){
    Products.select($scope.latestObj);
    Navigator.go('product');
  };
  $scope.watchlist = [];
  (function init(){
    Picks.latest().then(function(picks){
      angular.forEach(picks, function(p, i){
        Products.one(p.productNumber).then(function(one){
          if (i === 0){
            console.log(one.image_url);
            console.log("{ 'background-image': url('" + one.image_url + "') }");
            $scope.latest = "{ 'background-image': url('" + one.image_url + "') }";
            $scope.latestObj = one;
          }
          $scope.watchlist.push(one);
        });
      });
    }); // Picks.latest
  })();
});