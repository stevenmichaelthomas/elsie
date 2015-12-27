angular.module('elsie.common')
.factory('GCM', ['$q', '$mdToast', '$http', 'ELSIEAPI', 'elsie.session', 'Products', 'Navigator', function($q, $mdToast, $http, ELSIEAPI, Session, Products, Navigator) {
    
  var url = function(path) {
    return ELSIEAPI + '/users/' + Session.get('account').id + '/token';
  };

  var syncToken = function(token) {
    $http.put(url(), { gcmToken: token });
  };

  var successHandler = function(result) {
    syncToken(result.gcm);
  };

  var errorHandler = function(error) {
    $mdToast.showSimple('Elsie can\'t enable notifications. Check your system settings.');
  };

  window.onNotification = function(notification){
    console.log('notification', notification);
    if (notification.product){
      Products.one(notification.product).then(function(){
        Navigator.go('product');
      });
    }
  };

  return {
    initialize: function(){
      window.GcmPushPlugin.register(successHandler, errorHandler, {
        'badge': 'true',
        'sound': 'true',
        'alert': 'true',
        'usesGCM': true,
        'jsCallback': 'onNotification'
      });
    }
  };

}]);