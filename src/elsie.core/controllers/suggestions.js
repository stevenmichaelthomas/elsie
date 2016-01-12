angular.module('elsie.core')
.controller('SuggestionsCtrl', ['$scope', '$timeout', '$mdToast', 'Navigator', 'Friends', 'Suggestions', 'Products', 'Actions', 'elsie.session',
  function($scope, $timeout, $mdToast, Navigator, Friends, Suggestions, Products, Actions, Session) {
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
  $scope.modeSelect = function(){
    $scope.setTabsHeight();
  };
  $scope.loadInbox = function() {
    Suggestions.inbox().then(function(data){
      $scope.inbox = [];
      if (data.status && data.status === -1){
        $scope.error = data;
        return;
      }
      angular.forEach(data.data, function(suggestion){
        suggestion.creator_details = Friends.fromCache(suggestion.creator) || { firstName: 'Elsie' };
        Products.one(suggestion.productNumber).then(function(product){
          suggestion.product = product;
          $scope.inbox.push(suggestion);
        });
        if ($scope.inbox.length === data.data.length){
          $scope.inboxReady = true;
          console.log('inbox', $scope.inbox);
          if ($scope.outboxReady) {
            $scope.loading = false;
          }
        }
      });
    });
  };
  $scope.loadOutbox = function() {
    Suggestions.outbox().then(function(data){
      $scope.outbox = [];
      if (data.status && data.status === -1){
        $scope.error = data;
        return;
      }
      angular.forEach(data.data, function(suggestion){
        suggestion.creator_details = {
          firstName: 'You'
        };
        Products.one(suggestion.productNumber).then(function(product){
          suggestion.product = product;
          $scope.outbox.push(suggestion);
        });
        if ($scope.outbox.length === data.data.length){
          $scope.outboxReady = true;
          console.log('outbox', $scope.outbox);
          if ($scope.inboxReady) {
            $scope.loading = false;
          }
        }
      });
    });
  };
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
        Friends.get().then(function(){
          $scope.loadInbox();
          $scope.loadOutbox();
        });
      }, 500);
    }
  })();
}]);