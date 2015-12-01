angular.module('elsie.core')
.controller('WatchlistCtrl', ['$scope', '$timeout', '$mdToast', 'Navigator', 'Watchlist', 'Products', 'Actions', 'elsie.session',
  function($scope, $timeout, $mdToast, Navigator, Watchlist, Products, Actions, Session) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  $scope.go = function(destination){
    Navigator.go(destination);
  };
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
  $scope.importLegacyWatchlistData = function() {
    if (!$scope.legacyWatchlistExists) {
      return;
    }
    var watchlistData = Watchlist.loadLegacyWatchlistData();
    $scope.loading = true;
    angular.forEach(watchlistData, function(item, index){
      Products.one(item.id).then(function(product){
        Watchlist.changeProductStatus(product);
        var num = index + 1;
        if (num === watchlistData.length) {
          $scope.loading = false;
          $mdToast.showSimple('Your watchlist has been imported!'); 
        }
      });
    });
  };
  $scope.$on('WATCHLIST_REFRESH_START', function(){
    $scope.loading = true;
  });
  $scope.$on('WATCHLIST_REFRESH_COMPLETE', function(){
    $scope.watchlist = Watchlist.cache();
    $scope.loading = false;
    $mdToast.showSimple('Watchlist stock refreshed!'); 
  });
  (function(){
    Actions.theme('purple');
    Actions.set({ title: 'Watchlist', menu: false, back: true, search: false, watchlist: false, watchlistRefresh: true });
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }

    $scope.legacyWatchlistExists = Watchlist.checkForLegacyWatchlistData();
    
    if (Session.active()) {
      $scope.session = true;
      $timeout(function(){
        $scope.loadWatchlist();
      }, 500);
    }    
  })();
}]);