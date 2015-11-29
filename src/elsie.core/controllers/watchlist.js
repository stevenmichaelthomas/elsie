angular.module('elsie.core')
.controller('WatchlistCtrl', ['$scope', '$timeout', 'Navigator', 'Watchlist', 'Products', 'Actions', 'elsie.session',
  function($scope, $timeout, Navigator, Watchlist, Products, Actions, Session) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  $scope.$on('WATCHLIST_REFRESH_START', function(){
    $scope.loading = true;
  });
  $scope.$on('WATCHLIST_REFRESH_COMPLETE', function(){
    $scope.watchlist = Watchlist.cache();
    $scope.loading = false;
  });
  (function(){
    Actions.theme('purple');
    Actions.set({ title: 'Watchlist', menu: false, back: true, search: false, watchlist: false, watchlistRefresh: true });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    $scope.loadWatchlist = function() {
      Watchlist.load().then(function(data){
        if (data.status && data.status === -1){
          $scope.watchlist = [];
          $scope.error = data;
          return;
        }
        $scope.watchlist = data;
      });
    };
    if (Session.active()) {
      $scope.session = true;
      $timeout(function(){
        $scope.loadWatchlist();
      }, 500);
    }    
  })();
}]);