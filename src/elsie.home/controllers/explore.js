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
  $scope.getRating = function(num) {
    return new Array(num);   
  };
  $scope.watchlist = [];
  (function init(){
    Picks.latest().then(function(picks){
      angular.forEach(picks, function(p, i){
        Products.one(p.productNumber).then(function(one){
          if (i === 0){
            $scope.featuredStyle = { 
              'background-image': 'url(' + one.image_url + ')'
            };
            $scope.featured = one;
            $scope.featured.pick = p;
          }
          $scope.watchlist.push(one);
        });
      });
    }); // Picks.latest
  })();
});