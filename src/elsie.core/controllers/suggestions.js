/* global Velocity */
/* global facebookConnectPlugin */
angular.module('elsie.core')
.controller('SuggestionsCtrl', ['$scope', '$timeout', '$mdToast', 'Navigator', 'elsie.auth', 'Friends', 'Suggestions', 'Products', 'Actions', 'Settings', 'Dialog', 'elsie.session',
  function($scope, $timeout, $mdToast, Navigator, Auth, Friends, Suggestions, Products, Actions, Settings, Dialog, Session) {
  var fbLoginSuccess = function(data) {
    var account = Session.get('account').id;
    facebookConnectPlugin.getAccessToken(function(token) {
      Auth.facebookLink(token, account).then(function(res) {
        $mdToast.showSimple('Facebook account linked!');
        $scope.disabled = false;
      }, function(error){
        var message = error.data.message;
        var actions = [
          { label: 'OK' }
        ];
        var title = 'Facebook Auth Error';
        Dialog.show(message, actions, title);
      });
    }, function(error) {
      var message = error;
      var actions = [
        { label: 'OK' }
      ];
      var title = 'Facebook Auth Error';
      Dialog.show(message, actions, title);
    });
  };
  $scope.link = function() {
    if (!$scope.disabled) {
      return;
    }
    facebookConnectPlugin.login(['email','public_profile','user_friends'],
      fbLoginSuccess,
      function (error) { 
        $mdToast.showSimple(error); 
      }
    );
  };
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
    var tabsArea = viewport - 98;
    tabsArea = tabsArea + 'px';
    Velocity(document.getElementById('tabs'), {
      height: tabsArea
    }, {
      duration: 0
    });
  };
  $scope.modeSelect = function(){
    $timeout(function(){
      $scope.setTabsHeight();
    }, 350);
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
        suggestion.recipient_details = Friends.fromCache(suggestion.recipient);
        Products.one(suggestion.productNumber).then(function(product){
          suggestion.product = product;
          $scope.outbox.push(suggestion);
        });
        if ($scope.outbox.length === data.data.length){
          $scope.outboxReady = true;
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
    if (Session.active()){
      $scope.session = true;
    }
    if (Friends.enabled()) {
      $timeout(function(){
        $scope.setTabsHeight();
        Friends.get().then(function(){
          $scope.loadInbox();
          $scope.loadOutbox();
        });
      }, 500);
    } else {
      $scope.disabled = true;
    }
  })();
}]);