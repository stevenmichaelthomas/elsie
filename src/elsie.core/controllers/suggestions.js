angular.module('elsie.core')
.controller('SuggestionsCtrl', ['$scope', '$timeout', '$mdToast', 'Navigator', 'Suggestions', 'Products', 'Actions', 'elsie.session',
  function($scope, $timeout, $mdToast, Navigator, Suggestions, Products, Actions, Session) {
  $scope.loadProduct = function(product){
    if (product && product.product_no){
      Products.select(product);
      Navigator.go('product', 'forward');
    }
  };
  $scope.go = function(destination){
    Navigator.go(destination);
  };
  $scope.setTabsHeight = function(){
    var viewport = window.innerHeight + 20;
    var tabsArea = viewport - 40;
    tabsArea = tabsArea + 'px';
    $scope.tabsStyle = {
      height: tabsArea
    };
  };
  $scope.loadInbox = function() {
    Suggestions.inbox().then(function(data){
      if (data.status && data.status === -1){
        $scope.inbox = [];
        $scope.error = data;
        return;
      }
      $scope.watchlist = data;
    });
  };
  $scope.loadOutbox = function() {
    Suggestions.outbox().then(function(data){
      if (data.status && data.status === -1){
        $scope.outbox = [];
        $scope.error = data;
        return;
      }
      $scope.watchlist = data;
    });
  };
  $scope.$on('INBOX_REFRESH_START', function(){
    $scope.loading = true;
  });
  $scope.$on('INBOX_REFRESH_COMPLETE', function(){
    $scope.inbox = Suggestions.cache().inbox;
    $scope.loading = false;
    $mdToast.showSimple('Suggestions refreshed!'); 
  });
  (function(){
    Actions.theme('purple');
    Actions.set({ title: 'Suggestions', menu: false, back: true, search: false, watchlist: false, watchlistRefresh: false });
    Actions.show();
    if (Navigator.lastState() && Navigator.lastState().name === 'product' || Navigator.lastState() && Navigator.lastState().name === 'store'){
      Actions.backGoesHome(true);
    } else {
      Actions.backGoesHome(false);
    }
    
    if (Session.active()) {
      $scope.session = true;
      $timeout(function(){
        $scope.setTabsHeight();
        $scope.loadInbox();
        $scope.loadOutbox();
      }, 500);
    }    
  })();
}]);